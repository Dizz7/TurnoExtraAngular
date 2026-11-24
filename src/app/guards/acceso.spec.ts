import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { Auth } from '../services/auth';
import { cuentasDePrueba } from '../testing/almacen-pruebas';
describe('Acceso a rutas', () => {
  let auth:Auth;
  beforeEach(async () => { TestBed.configureTestingModule({providers:[provideRouter(routes),...cuentasDePrueba()]}); auth=TestBed.inject(Auth); await auth.preparado; });
  it('redirige al visitante a login conservando el destino de pago', async () => {
    const h=await RouterTestingHarness.create(); await h.navigateByUrl('/pago'); expect(TestBed.inject(Router).url).toBe('/login?volver=%2Fpago');
  });
  it('impide al cliente abrir el administrador mediante URL directa', async () => {
    await auth.ingresar('cliente@turnoextra.demo','Cliente123'); const h=await RouterTestingHarness.create(); await h.navigateByUrl('/admin'); expect(TestBed.inject(Router).url).toBe('/sin-acceso');
  });
  it('permite al administrador entrar al panel', async () => {
    await auth.ingresar('admin@turnoextra.demo','Admin123'); const h=await RouterTestingHarness.create(); await h.navigateByUrl('/admin'); expect(h.routeNativeElement?.textContent).toContain('Administrar catálogo');
  });
});
