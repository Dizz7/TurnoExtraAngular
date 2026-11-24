import { Injectable, inject, signal } from '@angular/core';
import { JUEGOS } from '../data/juegos';
import { Auth } from './auth';
/** Inventario de demostración durante la sesión de la aplicación. */
@Injectable({providedIn:'root'})
export class Catalogo {
  private readonly auth = inject(Auth);
  private readonly estado = signal(JUEGOS.map(j => ({...j})));
  readonly juegos = this.estado.asReadonly();
  actualizarStock(id: string, stock: number): void {
    if (!this.auth.esAdmin()) throw new Error('Solo el administrador puede modificar el stock.');
    if (!Number.isInteger(stock) || stock < 0 || stock > 9999) throw new Error('Ingresa un stock entero entre 0 y 9999.');
    this.estado.update(js => js.map(j => j.id === id ? {...j, stock} : j));
  }
  descontar(lineas: {id: string; cantidad: number}[]): void {
    if (!this.auth.usuario()) throw new Error('Inicia sesión para comprar.');
    if (!lineas.length || new Set(lineas.map(l => l.id)).size !== lineas.length || lineas.some(l => !Number.isInteger(l.cantidad) || l.cantidad < 1 || !this.estado().some(j => j.id === l.id && j.stock >= l.cantidad))) throw new Error('El stock cambió. Revisa tu carrito antes de pagar.');
    this.estado.update(js => js.map(j => ({...j, stock:j.stock - (lineas.find(l => l.id === j.id)?.cantidad ?? 0)})));
  }
}
