import { Injectable, computed, inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Usuario, DatosRegistro } from '../models/usuario';
import { ALMACEN, SESION } from './almacen';
import { CarritoDemo } from './carrito-demo';
import { CLAVE_VALIDATORS, validarEdad } from '../validators/cuenta';
/** Registro persistido que añade sal y resumen de contraseña a los datos públicos. */
interface Cuenta extends Usuario {
  /** Sal aleatoria utilizada en la derivación PBKDF2 de esta cuenta. */
  sal: string;
  /** Resumen hexadecimal derivado de la contraseña; no contiene la clave en texto legible. */
  resumen: string;
}
/** Gestiona cuentas y sesión de una demostración frontend. Deriva contraseñas con PBKDF2, pero los permisos y datos locales son manipulables y no sustituyen un servidor. */
@Injectable({ providedIn: 'root' })
export class Auth {
  /** Almacenamiento persistente de cuentas, sustituible en pruebas. */
  private readonly almacen = inject(ALMACEN);
  /** Almacenamiento de la sesión de la pestaña, sustituible en pruebas. */
  private readonly sesion = inject(SESION);
  /** Estado compartido del carrito temporal de la aplicación. */
  private readonly carrito = inject(CarritoDemo);
  /** Cuentas locales cargadas, con sal y resumen de contraseña. */
  private cuentas: Cuenta[] = [];
  /** Estado interno del usuario activo sin datos derivados de la contraseña. */
  private readonly actual = signal<Usuario | null>(null);
  /** Señal de solo lectura con el usuario activo, o null si no hay sesión. */
  readonly usuario = this.actual.asReadonly();
  /** Indica si el usuario activo tiene el rol administrador. */
  readonly esAdmin = computed(() => this.actual()?.rol === 'administrador');
  /** Promesa de inicialización que deben esperar los consumidores antes de usar cuentas restauradas. */
  readonly preparado = this.iniciar();
  /** Única solicitud de recuperación en memoria: cuenta, código, vencimiento e intentos fallidos. */
  private recuperacion?: { id: string; codigo: string; vence: number; intentos: number };
  /**
   * Deriva 256 bits mediante PBKDF2/SHA-256 y 100.000 iteraciones.
   * @param clave Contraseña que se procesará sin persistirla en texto legible.
   * @param sal Valor aleatorio específico de la cuenta.
   * @returns Resumen hexadecimal de la contraseña.
   */
  private async resumen(clave: string, sal: string): Promise<string> {
    const claveBase = await crypto.subtle.importKey('raw', new TextEncoder().encode(clave), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({name:'PBKDF2', salt:new TextEncoder().encode(sal), iterations:100000, hash:'SHA-256'}, claveBase, 256);
    return Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
  }
  /**
   * Crea la vista pública de una cuenta sin sal ni resumen.
   * @param cuenta Cuenta local completa.
   * @returns Datos del usuario que pueden exponerse a los componentes.
   */
  private publica(cuenta: Cuenta): Usuario {
    const { sal, resumen, ...usuario } = cuenta; return usuario;
  }
  /**
   * Carga y filtra cuentas locales; crea las cuentas demo si no quedan cuentas y restaura la sesión de la pestaña.
   * @returns Promesa que finaliza después de cargar las cuentas y restaurar el usuario.
   */
  private async iniciar(): Promise<void> {
    try { this.cuentas = JSON.parse(this.almacen.getItem('turnoextra.cuentas.v1') || '[]'); } catch { this.cuentas = []; }
    if (!Array.isArray(this.cuentas)) this.cuentas = [];
    this.cuentas = this.cuentas.filter(c => c && typeof c.id === 'string' && typeof c.email === 'string' && typeof c.username === 'string' && typeof c.resumen === 'string' && typeof c.sal === 'string' && ['cliente','administrador'].includes(c.rol));
    if (!this.cuentas.length) {
      for (const [username, rol, password] of [['cliente','cliente','Cliente123'], ['admin','administrador','Admin123']] as const) {
        const sal = crypto.randomUUID();
        this.cuentas.push({ id: crypto.randomUUID(), fullName: rol === 'cliente' ? 'Cliente de prueba' : 'Administrador de prueba', username, email: username+'@turnoextra.demo', birthDate:'2000-01-01', address:'', rol, sal, resumen:await this.resumen(password, sal) });
      }
      this.guardar(this.cuentas);
    }
    const cuenta = this.cuentas.find(c => c.id === this.sesion.getItem('turnoextra.sesion.v1'));
    if (cuenta) this.actual.set(this.publica(cuenta));
  }
  /**
   * Persiste las cuentas y actualiza la copia en memoria.
   * @param cuentas Lista completa que reemplazará el almacenamiento anterior.
   */
  private guardar(cuentas: Cuenta[]): void {
    this.almacen.setItem('turnoextra.cuentas.v1', JSON.stringify(cuentas)); this.cuentas = cuentas;
  }
  /**
   * Comprueba obligatoriedad, longitud de 6 a 18, mayúscula y número.
   * @param password Contraseña candidata.
   * @returns true cuando cumple los validadores compartidos.
   */
  private claveValida(password: string): boolean { return new FormControl(password, CLAVE_VALIDATORS).valid; }
  /**
   * Comprueba nombre, usuario, correo y edad mínima de 13 años.
   * @param datos Datos de perfil sin contraseña.
   * @returns true cuando los campos requeridos son válidos.
   */
  private datosValidos(datos: Omit<DatosRegistro, 'password'>): boolean {
    return !!datos.fullName.trim() && !!datos.username.trim() && !!datos.birthDate && new FormControl(datos.email.trim(), [Validators.required, Validators.email]).valid && !validarEdad(new FormControl(datos.birthDate));
  }
  /**
   * Crea una cuenta cliente con correo normalizado y contraseña derivada. No inicia sesión automáticamente.
   * @param datos Campos del formulario de registro.
   * @returns Promesa que finaliza después de persistir la nueva cuenta.
   * @throws Si los datos son inválidos o el correo o usuario ya existe.
   */
  async registrar(datos: DatosRegistro): Promise<void> {
    await this.preparado;
    if (!this.datosValidos(datos) || !this.claveValida(datos.password)) throw new Error('Revisa los datos y las reglas de contraseña.');
    const email = datos.email.trim().toLowerCase(), username = datos.username.trim();
    const sal = crypto.randomUUID(), resumen = await this.resumen(datos.password, sal);
    if (this.cuentas.some(c => c.email === email || c.username.toLowerCase() === username.toLowerCase())) throw new Error('El correo o nombre de usuario ya está registrado.');
    this.guardar([...this.cuentas, {id:crypto.randomUUID(), fullName:datos.fullName.trim(), username, email, birthDate:datos.birthDate, address:datos.address.trim(), rol:'cliente', sal, resumen}]);
  }
  /**
   * Comprueba credenciales y guarda la sesión; vacía el carrito al cambiar de usuario activo.
   * @param email Correo de la cuenta, normalizado antes de buscar.
   * @param password Contraseña que se compara mediante su resumen.
   * @returns Promesa que finaliza al establecer la sesión.
   * @throws Si el correo o la contraseña no coinciden.
   */
  async ingresar(email: string, password: string): Promise<void> {
    await this.preparado;
    const cuenta = this.cuentas.find(c => c.email === email.trim().toLowerCase());
    if (!cuenta || await this.resumen(password, cuenta.sal) !== cuenta.resumen) throw new Error('Correo o contraseña incorrectos.');
    if (this.actual() && this.actual()?.id !== cuenta.id) this.carrito.vaciar();
    this.sesion.setItem('turnoextra.sesion.v1', cuenta.id); this.actual.set(this.publica(cuenta));
  }
  /** Elimina la sesión de la pestaña, la recuperación pendiente y el carrito temporal. */
  salir(): void { this.sesion.removeItem('turnoextra.sesion.v1'); this.actual.set(null); this.recuperacion = undefined; this.carrito.vaciar(); }
  /**
   * Actualiza los campos permitidos del perfil conservando su identificador, rol y credenciales.
   * @param datos Nuevos datos de perfil sin contraseña.
   * @throws Si no hay sesión, los datos son inválidos o el correo o usuario ya existe.
   */
  actualizar(datos: Omit<DatosRegistro, 'password'>): void {
    const id = this.actual()?.id;
    if (!id) throw new Error('Inicia sesión para editar tu perfil.');
    if (!this.datosValidos(datos)) throw new Error('Revisa los datos del perfil y la fecha de nacimiento.');
    const email = datos.email.trim().toLowerCase(), username = datos.username.trim();
    if (this.cuentas.some(c => c.id !== id && (c.email === email || c.username.toLowerCase() === username.toLowerCase()))) throw new Error('El correo o nombre de usuario ya está registrado.');
    // Se seleccionan campos explícitos para que el perfil nunca pueda cambiar el rol.
    const cuentas = this.cuentas.map(c => c.id === id ? {...c, fullName:datos.fullName.trim(), username, email, birthDate:datos.birthDate, address:datos.address.trim()} : c);
    this.guardar(cuentas); this.actual.set(this.publica(cuentas.find(c => c.id === id)!));
  }
  /**
   * Reemplaza la solicitud pendiente con un código local de diez minutos y hasta cinco intentos incorrectos. No envía correo.
   * @param email Correo de una cuenta local existente.
   * @returns Código de demostración que la vista muestra al usuario.
   * @throws Si no existe una cuenta con ese correo.
   */
  async solicitarRecuperacion(email: string): Promise<string> {
    await this.preparado; this.recuperacion = undefined;
    const cuenta = this.cuentas.find(c => c.email === email.trim().toLowerCase());
    if (!cuenta) throw new Error('No existe una cuenta de demostración con ese correo.');
    const codigo = crypto.randomUUID();
    this.recuperacion = { id:cuenta.id, codigo, vence:Date.now()+10*60*1000, intentos:0 }; return codigo;
  }
  /**
   * Valida el código, deriva una nueva contraseña e invalida la solicitud; cierra la sesión si pertenece a esa cuenta.
   * @param codigo Código de recuperación presentado por el usuario.
   * @param password Nueva contraseña que debe cumplir las reglas compartidas.
   * @returns Promesa que finaliza después de persistir la nueva credencial.
   * @throws Si falta la solicitud, venció, agotó intentos, el código no coincide o la clave es inválida.
   */
  async restablecer(codigo: string, password: string): Promise<void> {
    const r = this.recuperacion;
    if (!r || r.vence < Date.now() || r.intentos >= 5) throw new Error('Solicita un nuevo código de recuperación.');
    if (r.codigo !== codigo.trim()) { r.intentos++; throw new Error('El código no coincide.'); }
    if (!this.claveValida(password)) throw new Error('La contraseña debe tener entre 6 y 18 caracteres, una mayúscula y un número.');
    const sal = crypto.randomUUID(), resumen = await this.resumen(password, sal);
    if (this.recuperacion !== r || r.vence < Date.now()) throw new Error('Solicita un nuevo código de recuperación.');
    this.guardar(this.cuentas.map(c => c.id === r.id ? {...c, sal, resumen} : c));
    this.recuperacion = undefined;
    if (this.actual()?.id === r.id) this.salir();
  }
}
