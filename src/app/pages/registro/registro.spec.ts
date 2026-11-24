import { provideRouter } from '@angular/router';
import { cuentasDePrueba } from '../../testing/almacen-pruebas';
import { Auth } from '../../services/auth';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Registro } from './registro';

describe('Registro', () => {
  let component: Registro;
  let fixture: ComponentFixture<Registro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), ...cuentasDePrueba()],
      imports: [Registro],
    }).compileComponents();

    await TestBed.inject(Auth).preparado;
    fixture = TestBed.createComponent(Registro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Datos válidos reutilizables en las pruebas.
  function completarFormulario(): void {
    component.formulario.setValue({
      fullName: 'Daniel Alarcón',
      username: 'daniel123',
      email: 'daniel@example.com',
      password: 'Clave123',
      confirmPassword: 'Clave123',
      birthDate: '2000-05-15',
      address: '',
    });
  }

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar con el formulario inválido', () => {
    expect(component.formulario.invalid).toBeTrue();
  });

  it('debería exigir los campos obligatorios', () => {
    component.registrar();

    expect(component.formulario.invalid).toBeTrue();
    expect(component.errores).toContain('Completa todos los campos obligatorios.');
    expect(component.registroExitoso).toBeFalse();
  });

  it('debería rechazar un correo inválido', () => {
    completarFormulario();

    component.formulario.controls.email.setValue('correo-invalido');

    expect(component.formulario.controls.email.invalid).toBeTrue();
  });

  it('debería exigir una mayúscula y un número', () => {
    completarFormulario();

    const password = component.formulario.controls.password;

    password.setValue('clave123');
    expect(password.invalid).toBeTrue();

    password.setValue('Claveabc');
    expect(password.invalid).toBeTrue();

    password.setValue('Clave123');
    expect(password.valid).toBeTrue();
  });

  it('debería exigir entre 6 y 18 caracteres', () => {
    completarFormulario();

    const password = component.formulario.controls.password;

    password.setValue('Ab1');
    expect(password.hasError('minlength')).toBeTrue();

    password.setValue('Clave123456789012345');
    expect(password.hasError('maxlength')).toBeTrue();

    password.setValue('Clave123');
    expect(password.valid).toBeTrue();
  });

  it('debería rechazar contraseñas diferentes', () => {
    completarFormulario();

    component.formulario.controls.confirmPassword.setValue('OtraClave123');

    expect(component.formulario.hasError('contrasenasDistintas')).toBeTrue();

    component.registrar();

    expect(component.errores).toContain('Las contraseñas no coinciden.');
  });

  it('debería rechazar usuarios menores de 13 años', () => {
    completarFormulario();

    const hoy = new Date();
    const fecha = new Date(hoy.getFullYear() - 12, hoy.getMonth(), hoy.getDate());

    const fechaTexto = [
      fecha.getFullYear(),
      String(fecha.getMonth() + 1).padStart(2, '0'),
      String(fecha.getDate()).padStart(2, '0'),
    ].join('-');

    component.formulario.controls.birthDate.setValue(fechaTexto);

    expect(component.formulario.controls.birthDate.hasError('edadMinima')).toBeTrue();
  });

  it('debería permitir dejar la dirección vacía', () => {
    completarFormulario();

    expect(component.formulario.valid).toBeTrue();
    expect(component.formulario.controls.address.valid).toBeTrue();
  });

  it('debería aceptar un formulario válido', async () => {
    completarFormulario();

    await component.registrar();

    expect(component.formulario.controls.password.value).toBe('');
    expect(component.registroExitoso).toBeTrue();
    expect(component.errores.length).toBe(0);
  });

  it('debería limpiar el formulario', async () => {
    completarFormulario();
    await component.registrar();

    component.limpiarFormulario();

    expect(component.formulario.controls.fullName.value).toBe('');
    expect(component.formulario.controls.email.value).toBe('');
    expect(component.formulario.controls.password.value).toBe('');
    expect(component.formulario.pristine).toBeTrue();
    expect(component.registroExitoso).toBeFalse();
    expect(component.errores.length).toBe(0);
  });
});
