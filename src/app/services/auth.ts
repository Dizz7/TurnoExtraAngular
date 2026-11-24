import { Injectable, computed, inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Usuario, DatosRegistro } from '../models/usuario';
import { ALMACEN, SESION } from './almacen';
import { CarritoDemo } from './carrito-demo';
import { CLAVE_VALIDATORS, validarEdad } from '../validators/cuenta';
interface Cuenta extends Usuario { sal: string; resumen: string; }
/** Simulación local académica. Los permisos reales requieren un servidor. */
@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly almacen = inject(ALMACEN);
  private readonly sesion = inject(SESION);
  private readonly carrito = inject(CarritoDemo);
  private cuentas: Cuenta[] = [];
  private readonly actual = signal<Usuario | null>(null);
  readonly usuario = this.actual.asReadonly();
  readonly esAdmin = computed(() => this.actual()?.rol === 'administrador');
  readonly preparado = this.iniciar();
  private recuperacion?: { id: string; codigo: string; vence: number; intentos: number };
  private async resumen(clave: string, sal: string): Promise<string> {
    const claveBase = await crypto.subtle.importKey('raw', new TextEncoder().encode(clave), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({name:'PBKDF2', salt:new TextEncoder().encode(sal), iterations:100000, hash:'SHA-256'}, claveBase, 256);
    return Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
  }
  private publica(cuenta: Cuenta): Usuario {
    const { sal, resumen, ...usuario } = cuenta; return usuario;
  }
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
  private guardar(cuentas: Cuenta[]): void {
    this.almacen.setItem('turnoextra.cuentas.v1', JSON.stringify(cuentas)); this.cuentas = cuentas;
  }
  private claveValida(password: string): boolean { return new FormControl(password, CLAVE_VALIDATORS).valid; }
  private datosValidos(datos: Omit<DatosRegistro, 'password'>): boolean {
    return !!datos.fullName.trim() && !!datos.username.trim() && !!datos.birthDate && new FormControl(datos.email.trim(), [Validators.required, Validators.email]).valid && !validarEdad(new FormControl(datos.birthDate));
  }
  async registrar(datos: DatosRegistro): Promise<void> {
    await this.preparado;
    if (!this.datosValidos(datos) || !this.claveValida(datos.password)) throw new Error('Revisa los datos y las reglas de contraseña.');
    const email = datos.email.trim().toLowerCase(), username = datos.username.trim();
    const sal = crypto.randomUUID(), resumen = await this.resumen(datos.password, sal);
    if (this.cuentas.some(c => c.email === email || c.username.toLowerCase() === username.toLowerCase())) throw new Error('El correo o nombre de usuario ya está registrado.');
    this.guardar([...this.cuentas, {id:crypto.randomUUID(), fullName:datos.fullName.trim(), username, email, birthDate:datos.birthDate, address:datos.address.trim(), rol:'cliente', sal, resumen}]);
  }
  async ingresar(email: string, password: string): Promise<void> {
    await this.preparado;
    const cuenta = this.cuentas.find(c => c.email === email.trim().toLowerCase());
    if (!cuenta || await this.resumen(password, cuenta.sal) !== cuenta.resumen) throw new Error('Correo o contraseña incorrectos.');
    if (this.actual() && this.actual()?.id !== cuenta.id) this.carrito.vaciar();
    this.sesion.setItem('turnoextra.sesion.v1', cuenta.id); this.actual.set(this.publica(cuenta));
  }
  salir(): void { this.sesion.removeItem('turnoextra.sesion.v1'); this.actual.set(null); this.recuperacion = undefined; this.carrito.vaciar(); }
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
  async solicitarRecuperacion(email: string): Promise<string> {
    await this.preparado; this.recuperacion = undefined;
    const cuenta = this.cuentas.find(c => c.email === email.trim().toLowerCase());
    if (!cuenta) throw new Error('No existe una cuenta de demostración con ese correo.');
    const codigo = crypto.randomUUID();
    this.recuperacion = { id:cuenta.id, codigo, vence:Date.now()+10*60*1000, intentos:0 }; return codigo;
  }
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
