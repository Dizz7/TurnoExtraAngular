import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Categoria } from './categoria';
import { routes } from '../../app.routes';
import { Auth } from '../../services/auth';
import { CarritoDemo } from '../../services/carrito-demo';
import { cuentasDePrueba } from '../../testing/almacen-pruebas';
describe('Búsqueda independiente del catálogo', () => {
  let h: RouterTestingHarness, c: Categoria;
  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), ...cuentasDePrueba()] });
    await TestBed.inject(Auth).preparado;
    h = await RouterTestingHarness.create();
    c = await h.navigateByUrl('/estrategia', Categoria);
    await h.fixture.whenStable();
  });
  async function buscar(texto: string): Promise<void> {
    const input = h.routeNativeElement!.querySelector('#buscar-juegos') as HTMLInputElement;
    input.value = texto;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    h.detectChanges();
    await h.fixture.whenStable();
    h.detectChanges();
  }
  it('vincula ngModel y filtra ignorando tildes, mayúsculas y espacios externos', async () => {
    await buscar(' KURRUF ');
    expect(c.busqueda).toBe(' KURRUF ');
    expect(c.juegosFiltrados.map((j) => j.id)).toEqual(['kurruf']);
    expect(h.routeNativeElement!.querySelectorAll('app-tarjeta-juego').length).toBe(1);
    expect(h.routeNativeElement!.querySelector('#resultados-busqueda')?.textContent).toContain(
      '1 de 3',
    );
  });
  it('busca también en la descripción del producto', async () => {
    await buscar('aves');
    expect(c.juegosFiltrados.map((j) => j.id)).toEqual(['wingspan']);
  });
  it('muestra ausencia de resultados y limpiar restablece las tarjetas y el input', async () => {
    await buscar('inexistente');
    expect(h.routeNativeElement!.querySelector('.search-empty')?.textContent).toContain(
      'No encontramos juegos',
    );
    (h.routeNativeElement!.querySelector('.search-controls button') as HTMLButtonElement).click();
    h.detectChanges();
    await h.fixture.whenStable();
    h.detectChanges();
    expect(c.busqueda).toBe('');
    expect((h.routeNativeElement!.querySelector('#buscar-juegos') as HTMLInputElement).value).toBe(
      '',
    );
    expect(h.routeNativeElement!.querySelectorAll('app-tarjeta-juego').length).toBe(3);
  });
  it('reinicia la búsqueda al navegar a otra categoría', async () => {
    await buscar('wingspan');
    const nueva = await h.navigateByUrl('/fiesta', Categoria);
    expect(nueva.busqueda).toBe('');
    expect(nueva.juegosFiltrados.length).toBe(3);
    expect(nueva.juegos.every((j) => j.categoria === 'fiesta')).toBeTrue();
  });
  it('mantiene la comunicación hijo-padre y el carrito al filtrar', async () => {
    await buscar('wingspan');
    (h.routeNativeElement!.querySelector('app-tarjeta-juego button') as HTMLButtonElement).click();
    h.detectChanges();
    expect(TestBed.inject(CarritoDemo).cantidadCarrito()).toBe(1);
    expect(h.routeNativeElement!.querySelector('.cart-summary')?.textContent).toContain('Wingspan');
  });
  it('mantiene la ruta de categoría al usar el enlace interno al catálogo', async () => {
    const enlace = h.routeNativeElement!.querySelector('a[fragment="juegos"]') as HTMLAnchorElement;
    expect(enlace.getAttribute('href')).toBe('/estrategia#juegos');
    enlace.click();
    await h.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/estrategia#juegos');
  });
  it('mantiene la ruta de registro al saltar al formulario', async () => {
    await h.navigateByUrl('/registro');
    const enlace = h.routeNativeElement!.querySelector(
      'a[fragment="registro"]',
    ) as HTMLAnchorElement;
    expect(enlace.getAttribute('href')).toBe('/registro#registro');
    enlace.click();
    await h.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/registro#registro');
  });
});
