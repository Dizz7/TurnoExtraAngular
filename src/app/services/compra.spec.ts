import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { Catalogo } from './catalogo';
import { CarritoDemo } from './carrito-demo';
import { Pago } from '../pages/pago/pago';
import { cuentasDePrueba } from '../testing/almacen-pruebas';
describe('Carrito, inventario y compra simulada', () => {
  let auth:Auth, catalogo:Catalogo, carrito:CarritoDemo;
  beforeEach(async () => { TestBed.configureTestingModule({providers:[provideRouter([]),...cuentasDePrueba()]}); auth=TestBed.inject(Auth); await auth.preparado; catalogo=TestBed.inject(Catalogo); carrito=TestBed.inject(CarritoDemo); });
  it('agrupa productos, calcula totales y permite cambiar y eliminar cantidades', () => {
    const j=catalogo.juegos()[0]; carrito.agregar(j); carrito.agregar(j);
    expect(carrito.lineas().length).toBe(1); expect(carrito.total()).toBe(j.precio*2);
    carrito.cambiar(j.id,3); expect(carrito.cantidadCarrito()).toBe(3);
    carrito.cambiar(j.id,999); expect(carrito.cantidadCarrito()).toBe(3);
    carrito.quitar(j.id); expect(carrito.total()).toBe(0);
  });
  it('impide agregar más unidades que el stock', () => {
    const j={...catalogo.juegos()[0],stock:1}; carrito.agregar(j); carrito.agregar(j); expect(carrito.cantidadCarrito()).toBe(1);
  });
  it('solo permite al administrador editar stock y valida enteros', async () => {
    const id=catalogo.juegos()[0].id;
    expect(() => catalogo.actualizarStock(id,2)).toThrow();
    await auth.ingresar('cliente@turnoextra.demo','Cliente123'); expect(() => catalogo.actualizarStock(id,2)).toThrow();
    await auth.ingresar('admin@turnoextra.demo','Admin123'); expect(() => catalogo.actualizarStock(id,1.5)).toThrow();
    catalogo.actualizarStock(id,2); expect(catalogo.juegos()[0].stock).toBe(2);
  });
  it('exige confirmación, genera comprobante, descuenta stock y evita doble pago', async () => {
    await auth.ingresar('cliente@turnoextra.demo','Cliente123'); const j=catalogo.juegos()[0]; carrito.agregar(j);
    const pago=TestBed.runInInjectionContext(() => new Pago()); pago.pagar(); expect(pago.comprobante).toBeUndefined();
    pago.acepto.setValue(true); pago.pagar(); expect(pago.comprobante?.total).toBe(j.precio); expect(carrito.total()).toBe(0); expect(catalogo.juegos()[0].stock).toBe(j.stock-1);
    pago.pagar(); expect(catalogo.juegos()[0].stock).toBe(j.stock-1);
  });
  it('no descuenta inventario si alguna línea supera el stock actual', async () => {
    await auth.ingresar('cliente@turnoextra.demo','Cliente123'); const [a,b]=catalogo.juegos();
    expect(() => catalogo.descontar([{id:a.id,cantidad:1},{id:b.id,cantidad:999}])).toThrow(); expect(catalogo.juegos()[0].stock).toBe(a.stock);
  });
  it('rechaza pago sin sesión o con carrito vacío', async () => {
    const pago=TestBed.runInInjectionContext(() => new Pago()); pago.acepto.setValue(true); pago.pagar(); expect(pago.comprobante).toBeUndefined();
    await auth.ingresar('cliente@turnoextra.demo','Cliente123'); pago.pagar(); expect(pago.comprobante).toBeUndefined();
  });
  it('envía el formulario de pago sin recargar y conserva el comprobante en pantalla', async () => {
    await auth.ingresar('cliente@turnoextra.demo','Cliente123'); carrito.agregar(catalogo.juegos()[0]);
    const fixture=TestBed.createComponent(Pago); fixture.detectChanges();
    fixture.componentInstance.acepto.setValue(true);
    const evento=new Event('submit',{bubbles:true,cancelable:true});
    fixture.nativeElement.querySelector('form').dispatchEvent(evento); fixture.detectChanges();
    expect(evento.defaultPrevented).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('¡Compra simulada exitosa!');
  });

});
