import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoDemo } from '../../services/carrito-demo';
import { Auth } from '../../services/auth';
/** Vista del carrito temporal con cantidades, importes y acceso al pago simulado. */
@Component({selector:'app-carrito', imports:[RouterLink], templateUrl:'./carrito.html', styleUrl:'../../styles/cuenta.css'})
export class Carrito {
  /** Estado compartido del carrito temporal de la aplicación. */
  readonly carrito=inject(CarritoDemo);
  /** Servicio de cuentas y sesión local utilizado por esta vista. */
  readonly auth=inject(Auth);
  /**
   * Formatea un importe en pesos chilenos usando la configuración es-CL.
   * @param n Importe que se mostrará.
   * @returns Importe con prefijo de peso y separadores locales.
   */
  precio(n:number):string { return '$'+n.toLocaleString('es-CL'); }
}
