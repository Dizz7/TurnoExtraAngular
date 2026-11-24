import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { ALMACEN } from './almacen';
import { cuentasDePrueba } from '../testing/almacen-pruebas';
import { CarritoDemo } from './carrito-demo';
import { JUEGOS } from '../data/juegos';
const datos = {fullName:'Persona de prueba', username:'persona', email:'persona@example.com', password:'Clave123', birthDate:'2000-01-01', address:''};
describe('Cuentas y permisos', () => {
  let auth:Auth;
  beforeEach(async () => { TestBed.configureTestingModule({providers:cuentasDePrueba()}); auth=TestBed.inject(Auth); await auth.preparado; });
  it('registra clientes, permite login y no guarda contraseñas legibles', async () => {
    await auth.registrar(datos); await auth.ingresar(' PERSONA@EXAMPLE.COM ', datos.password);
    expect(auth.usuario()?.rol).toBe('cliente'); expect(auth.usuario()?.username).toBe('persona');
    expect(TestBed.inject(ALMACEN).getItem('turnoextra.cuentas.v1')).not.toContain('Clave123');
  });
  it('rechaza correos y usuarios duplicados sin distinguir mayúsculas', async () => {
    await auth.registrar(datos);
    await expectAsync(auth.registrar({...datos, email:'PERSONA@EXAMPLE.COM', username:'otra'})).toBeRejected();
    await expectAsync(auth.registrar({...datos, email:'otra@example.com', username:'PERSONA'})).toBeRejected();
  });
  it('rechaza credenciales incorrectas y distingue al administrador', async () => {
    await expectAsync(auth.ingresar('admin@turnoextra.demo','Incorrecta123')).toBeRejected(); expect(auth.usuario()).toBeNull();
    await auth.ingresar('admin@turnoextra.demo','Admin123'); expect(auth.esAdmin()).toBeTrue();
  });
  it('actualiza el perfil sin permitir elevar el rol', async () => {
    await auth.ingresar('cliente@turnoextra.demo','Cliente123');
    auth.actualizar({...datos, rol:'administrador'} as typeof datos);
    expect(auth.usuario()?.fullName).toBe(datos.fullName); expect(auth.esAdmin()).toBeFalse();
    auth.salir(); await auth.ingresar(datos.email,'Cliente123'); expect(auth.usuario()?.email).toBe(datos.email);
  });
  it('rechaza un perfil con correo duplicado o edad inválida', async () => {
    await auth.ingresar('cliente@turnoextra.demo','Cliente123');
    expect(() => auth.actualizar({...datos,email:'admin@turnoextra.demo'})).toThrow();
    expect(() => auth.actualizar({...datos,birthDate:'2099-01-01'})).toThrow();
  });
  it('recupera la cuenta con código de un solo uso e invalida la contraseña anterior', async () => {
    const codigo=await auth.solicitarRecuperacion('cliente@turnoextra.demo');
    await expectAsync(auth.restablecer('incorrecto','Nueva123')).toBeRejected();
    await auth.restablecer(codigo,'Nueva123');
    await expectAsync(auth.restablecer(codigo,'Otra123')).toBeRejected();
    await expectAsync(auth.ingresar('cliente@turnoextra.demo','Cliente123')).toBeRejected();
    await auth.ingresar('cliente@turnoextra.demo','Nueva123'); expect(auth.usuario()?.rol).toBe('cliente');
  });
  it('rechaza códigos vencidos y contraseñas débiles', async () => {
    const codigo=await auth.solicitarRecuperacion('cliente@turnoextra.demo');
    await expectAsync(auth.restablecer(codigo,'abc')).toBeRejected();
    const ahora=Date.now(); spyOn(Date,'now').and.returnValue(ahora+11*60*1000);
    await expectAsync(auth.restablecer(codigo,'Nueva123')).toBeRejected();
  });
  it('cierra la sesión y vacía el carrito para no compartirlo entre usuarios', async () => {
    await auth.ingresar('cliente@turnoextra.demo','Cliente123'); const carrito=TestBed.inject(CarritoDemo); carrito.agregar(JUEGOS[0]);
    auth.salir(); expect(auth.usuario()).toBeNull(); expect(carrito.cantidadCarrito()).toBe(0);
  });
});
