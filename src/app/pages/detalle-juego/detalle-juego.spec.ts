import { cuentasDePrueba } from '../../testing/almacen-pruebas';
import { Auth } from '../../services/auth';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { DetalleJuego } from './detalle-juego';
import { routes } from '../../app.routes';
import { JUEGOS } from '../../data/juegos';
import { CarritoDemo } from '../../services/carrito-demo';

describe('DetalleJuego', () => {
  beforeEach(async () => { TestBed.configureTestingModule({ providers: [provideRouter(routes), ...cuentasDePrueba()] }); await TestBed.inject(Auth).preparado; });

  it('muestra cada juego al abrir su URL directamente', async () => {
    const harness = await RouterTestingHarness.create();
    for (const juego of JUEGOS) {
      await harness.navigateByUrl('/juegos/' + juego.id, DetalleJuego);
      expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe(juego.nombre);
      expect(harness.routeNativeElement?.querySelector('img')?.getAttribute('src')).toBe(juego.imagen);
    }
  });

  it('actualiza el mismo componente al cambiar de juego', async () => {
    const harness = await RouterTestingHarness.create();
    const primero = await harness.navigateByUrl('/juegos/wingspan', DetalleJuego);
    const segundo = await harness.navigateByUrl('/juegos/kurruf', DetalleJuego);
    expect(segundo).toBe(primero);
    expect(segundo.juego()?.nombre).toBe('Kurrüf');
    expect(harness.routeNativeElement?.querySelector('.discount-badge')?.textContent).toContain('15%');
    expect(harness.routeNativeElement?.querySelector('.detail-back')?.getAttribute('href')).toBe('/estrategia');
  });

  it('muestra una salida útil para IDs desconocidos sin conservar el juego anterior', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/juegos/wingspan', DetalleJuego);
    const component = await harness.navigateByUrl('/juegos/no-existe', DetalleJuego);
    expect(component.juego()).toBeUndefined();
    expect(harness.routeNativeElement?.textContent).toContain('Juego no encontrado');
    expect(harness.routeNativeElement?.querySelector('a')?.getAttribute('href')).toBe('/');
    expect(harness.routeNativeElement?.querySelector('button')).toBeNull();
  });

  it('comparte el contador al agregar desde detalle y volver al catálogo', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/juegos/wingspan', DetalleJuego);
    (harness.routeNativeElement?.querySelector('button') as HTMLButtonElement).click();
    await harness.navigateByUrl('/estrategia');
    expect(TestBed.inject(CarritoDemo).cantidadCarrito()).toBe(1);
    expect(harness.routeNativeElement?.querySelector('.cart-count')?.textContent).toContain('1');
    expect(harness.routeNativeElement?.querySelector('.cart-summary')?.textContent).toContain('Wingspan');
  });

  it('desactiva la compra cuando el juego está agotado', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/juegos/wingspan', DetalleJuego);
    component.juego.set({ ...JUEGOS[0], stock: 0 });
    harness.detectChanges();
    const button = harness.routeNativeElement?.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
    button.click();
    expect(TestBed.inject(CarritoDemo).cantidadCarrito()).toBe(0);
    expect(harness.routeNativeElement?.textContent).toContain('Agotado');
  });
});
