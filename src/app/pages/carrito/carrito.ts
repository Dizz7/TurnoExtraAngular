import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoDemo } from '../../services/carrito-demo';
import { Auth } from '../../services/auth';
@Component({selector:'app-carrito', imports:[RouterLink], templateUrl:'./carrito.html', styleUrl:'../../styles/cuenta.css'})
export class Carrito {
  readonly carrito=inject(CarritoDemo); readonly auth=inject(Auth);
  precio(n:number):string { return '$'+n.toLocaleString('es-CL'); }
}
