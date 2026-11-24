import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { cuentasDePrueba } from './almacen-pruebas';
import { Auth } from '../services/auth';
import { Registro } from '../pages/registro/registro';
import { Perfil } from '../pages/perfil/perfil';
import { Recuperar } from '../pages/recuperar/recuperar';
import { Login } from '../pages/login/login';
const datos = {
  fullName: 'Prueba formularios',
  username: 'pruebaformularios',
  email: 'formularios@example.com',
  password: 'Clave123',
  confirmPassword: 'Clave123',
  birthDate: '2000-01-01',
  address: '',
};
describe('Retroalimentación de formularios', () => {
  let auth: Auth;
  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), ...cuentasDePrueba()] });
    auth = TestBed.inject(Auth);
    await auth.preparado;
  });
  it('muestra errores asociados a cada campo y limpiar restaura el registro', async () => {
    const f = TestBed.createComponent(Registro);
    f.detectChanges();
    await f.componentInstance.registrar();
    f.detectChanges();
    const input: HTMLInputElement = f.nativeElement.querySelector('#email');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('email-error');
    expect(f.nativeElement.querySelector('#email-error').textContent).toContain('Completa');
    f.componentInstance.limpiarFormulario();
    f.detectChanges();
    expect(f.nativeElement.querySelector('#email-error')).toBeNull();
    expect(f.componentInstance.formulario.pristine).toBeTrue();
  });
  it('limpia claves al registrar y retira el éxito si se editan los datos', async () => {
    const f = TestBed.createComponent(Registro);
    const c = f.componentInstance;
    c.formulario.setValue(datos);
    await c.registrar();
    expect(c.registroExitoso).toBeTrue();
    expect(c.formulario.controls.password.value).toBe('');
    c.formulario.controls.username.setValue('otra');
    expect(c.registroExitoso).toBeFalse();
  });
  it('retira el éxito del perfil al editar y descarta cambios no guardados', async () => {
    await auth.ingresar('cliente@turnoextra.demo', 'Cliente123');
    const c = TestBed.createComponent(Perfil).componentInstance;
    c.formulario.controls.fullName.setValue('Nombre guardado');
    c.guardar();
    expect(c.exito).toBeTrue();
    c.formulario.controls.fullName.setValue('Nombre sin guardar');
    expect(c.exito).toBeFalse();
    c.restaurar();
    expect(c.formulario.controls.fullName.value).toBe('Nombre guardado');
    expect(c.formulario.pristine).toBeTrue();
  });
  it('oculta el código anterior si cambia el correo de recuperación', async () => {
    const c = TestBed.createComponent(Recuperar).componentInstance;
    c.correo.setValue('cliente@turnoextra.demo');
    await c.solicitar();
    expect(c.codigoDemo).toBeTruthy();
    c.formulario.controls.codigo.setValue(c.codigoDemo);
    c.correo.setValue('admin@turnoextra.demo');
    expect(c.codigoDemo).toBe('');
    expect(c.formulario.controls.codigo.value).toBe('');
  });
  it('bloquea campos y evita envíos duplicados mientras se guarda el registro', async () => {
    let terminar!: () => void;
    const pendiente = new Promise<void>((resolve) => (terminar = resolve));
    const guardar = spyOn(auth, 'registrar').and.returnValue(pendiente);
    const f = TestBed.createComponent(Registro);
    const c = f.componentInstance;
    c.formulario.setValue(datos);
    const envio = c.registrar();
    await c.registrar();
    f.detectChanges();
    expect(guardar).toHaveBeenCalledTimes(1);
    expect(f.nativeElement.querySelector('fieldset').disabled).toBeTrue();
    terminar();
    await envio;
    f.detectChanges();
    expect(f.nativeElement.querySelector('fieldset').disabled).toBeFalse();
  });
  it('quita el error de acceso al corregir credenciales', async () => {
    const c = TestBed.createComponent(Login).componentInstance;
    c.formulario.setValue({ email: 'cliente@turnoextra.demo', password: 'Incorrecta123' });
    await c.ingresar();
    expect(c.error).toBeTruthy();
    c.formulario.controls.password.setValue('Cliente123');
    expect(c.error).toBe('');
  });
});
