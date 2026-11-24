import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Header } from './header';
import { routes } from '../../app.routes';
import { Auth } from '../../services/auth';
import { cuentasDePrueba } from '../../testing/almacen-pruebas';
describe('Menú desplegable de categorías', () => {
  let f: ComponentFixture<Header>;
  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes), ...cuentasDePrueba()] });
    await TestBed.inject(Auth).preparado;
    f = TestBed.createComponent(Header);
    f.detectChanges();
  });
  function abrir(): HTMLButtonElement {
    const boton = f.nativeElement.querySelector('.category-toggle') as HTMLButtonElement;
    boton.click();
    f.detectChanges();
    return boton;
  }
  it('abre y cierra las cuatro categorías con estado accesible', () => {
    const boton = abrir();
    expect(boton.getAttribute('aria-expanded')).toBe('true');
    expect(f.nativeElement.querySelectorAll('#categorias-menu a').length).toBe(4);
    boton.click();
    f.detectChanges();
    expect(boton.getAttribute('aria-expanded')).toBe('false');
    expect(f.nativeElement.querySelector('#categorias-menu')).toBeNull();
  });
  it('navega con Router y cierra ambos menús al seleccionar una categoría', async () => {
    f.componentInstance.alternarMenu();
    abrir();
    (
      f.nativeElement.querySelector('#categorias-menu a[href="/familiares"]') as HTMLAnchorElement
    ).click();
    await f.whenStable();
    f.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/familiares');
    expect(f.componentInstance.menuAbierto()).toBeFalse();
    expect(f.componentInstance.categoriasAbiertas()).toBeFalse();
  });
  it('cierra con Escape y devuelve el foco al botón de categorías', () => {
    // En anchos móviles, el desplegable debe estar dentro de un menú visible.
    f.componentInstance.alternarMenu();
    f.detectChanges();
    const boton = abrir();
    const enlace = f.nativeElement.querySelector('#categorias-menu a') as HTMLAnchorElement;
    enlace.focus();
    expect(document.activeElement).toBe(enlace);
    enlace.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    f.detectChanges();
    expect(f.componentInstance.categoriasAbiertas()).toBeFalse();
    expect(document.activeElement).toBe(boton);
    expect(f.componentInstance.menuAbierto()).toBeTrue();
    expect(f.nativeElement.querySelector('#categorias-menu')).toBeNull();
  });
  it('cierra al hacer clic fuera del encabezado', () => {
    f.componentInstance.alternarMenu();
    abrir();
    document.body.click();
    f.detectChanges();
    expect(f.componentInstance.menuAbierto()).toBeFalse();
    expect(f.componentInstance.categoriasAbiertas()).toBeFalse();
  });
});
