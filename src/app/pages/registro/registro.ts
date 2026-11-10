
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type CampoRegistro =
  | 'fullName'
  | 'username'
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'birthDate'
  | 'address';

interface DatosRegistro {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  address: string;
}

@Component({
  selector: 'app-registro',
  imports: [FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  // Datos vinculados con ngModel.
  datos: DatosRegistro = this.datosIniciales();

  // Estado de las validaciones.
  errores: string[] = [];
  camposValidados: Partial<Record<CampoRegistro, boolean>> = {};

  registroExitoso = false;
  animarBoton = false;

  private datosIniciales(): DatosRegistro {
    return {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthDate: '',
      address: ''
    };
  }

  // Validar correo electrónico.
  private correoValido(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      this.datos.email.trim()
    );
  }

  // Validar contraseña.
  private contrasenaValida(): boolean {
    const clave = this.datos.password;

    return (
      clave.length >= 6 &&
      clave.length <= 18 &&
      /[A-Z]/.test(clave) &&
      /[0-9]/.test(clave)
    );
  }

  // Calcular edad a partir de una fecha.
  private calcularEdad(fecha: string): number {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const hoy = new Date();

    let edad = hoy.getFullYear() - anio;

    const cumplioAnios =
      hoy.getMonth() + 1 > mes ||
      (
        hoy.getMonth() + 1 === mes &&
        hoy.getDate() >= dia
      );

    if (!cumplioAnios) {
      edad--;
    }

    return edad;
  }

  // Verificar que la fecha exista y no sea futura.
  private fechaValida(): boolean {
    const valor = this.datos.birthDate;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      return false;
    }

    const [anio, mes, dia] = valor.split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    const hoy = new Date();

    hoy.setHours(23, 59, 59, 999);

    return (
      fecha.getFullYear() === anio &&
      fecha.getMonth() + 1 === mes &&
      fecha.getDate() === dia &&
      fecha <= hoy
    );
  }

  // Validar un campo individual.
  validarCampo(campo: CampoRegistro): void {
    const valor = this.datos[campo].trim();
    let valido = true;

    switch (campo) {
      case 'fullName':
      case 'username':
        valido = valor.length > 0;
        break;

      case 'email':
        valido = this.correoValido();
        break;

      case 'password':
        valido = this.contrasenaValida();
        break;

      case 'confirmPassword':
        valido =
          valor.length > 0 &&
          this.datos.confirmPassword === this.datos.password;
        break;

      case 'birthDate':
        valido =
          this.fechaValida() &&
          this.calcularEdad(this.datos.birthDate) >= 13;
        break;

      case 'address':
        // La dirección es opcional.
        if (!valor) {
          delete this.camposValidados.address;
          return;
        }
        valido = true;
        break;
    }

    this.camposValidados[campo] = valido;
  }

  // Clases CSS de validación.
  claseCampo(campo: CampoRegistro): string {
    const estado = this.camposValidados[campo];

    if (estado === true) {
      return 'is-valid';
    }

    if (estado === false) {
      return 'is-invalid';
    }

    return '';
  }

  // Actualizar validación mientras se escribe.
  actualizarContrasena(): void {
    this.validarCampo('password');

    if (this.datos.confirmPassword) {
      this.validarCampo('confirmPassword');
    }
  }

  actualizarConfirmacion(): void {
    if (this.datos.confirmPassword) {
      this.validarCampo('confirmPassword');
    }
  }

  // Validar el formulario completo.
  registrar(): void {
    this.errores = [];
    this.registroExitoso = false;

    const obligatorios: CampoRegistro[] = [
      'fullName',
      'username',
      'email',
      'password',
      'confirmPassword',
      'birthDate'
    ];

    const faltanCampos = obligatorios.some(
      campo => !this.datos[campo].trim()
    );

    if (faltanCampos) {
      this.errores.push(
        'Completa todos los campos obligatorios.'
      );
    }

    if (this.datos.email.trim() && !this.correoValido()) {
      this.errores.push(
        'Ingresa un correo electrónico válido.'
      );
    }

    if (this.datos.password) {
      const clave = this.datos.password;

      if (clave.length < 6 || clave.length > 18) {
        this.errores.push(
          'La contraseña debe tener entre 6 y 18 caracteres.'
        );
      }

      if (!/[A-Z]/.test(clave) || !/[0-9]/.test(clave)) {
        this.errores.push(
          'La contraseña debe incluir una mayúscula y un número.'
        );
      }
    }

    if (
      this.datos.password &&
      this.datos.confirmPassword &&
      this.datos.password !== this.datos.confirmPassword
    ) {
      this.errores.push(
        'Las contraseñas no coinciden.'
      );
    }

    if (this.datos.birthDate) {
      if (!this.fechaValida()) {
        this.errores.push(
          'Ingresa una fecha de nacimiento válida.'
        );
      } else if (this.calcularEdad(this.datos.birthDate) < 13) {
        this.errores.push(
          'Debes tener al menos 13 años para registrarte.'
        );
      }
    }

    // Actualizar estilos de todos los campos.
    const campos: CampoRegistro[] = [
      ...obligatorios,
      'address'
    ];

    campos.forEach(campo => this.validarCampo(campo));

    if (this.errores.length > 0) {
      this.animarBoton = true;
      return;
    }

    // Demostración de registro: aún no guarda cuentas.
    this.registroExitoso = true;
    this.animarBoton = false;
  }

  // Permitir repetir la animación al enviar.
  finalizarAnimacion(): void {
    this.animarBoton = false;
  }

  // Limpiar formulario y estados.
  limpiarFormulario(): void {
    this.datos = this.datosIniciales();
    this.errores = [];
    this.camposValidados = {};
    this.registroExitoso = false;
    this.animarBoton = false;
  }
}
