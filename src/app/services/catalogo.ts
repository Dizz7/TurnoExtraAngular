import { Injectable, inject, signal } from '@angular/core';
import { JUEGOS } from '../data/juegos';
import { Auth } from './auth';
/** Inventario en memoria inicializado desde los datos del catálogo; se reinicia al recargar. */
@Injectable({providedIn:'root'})
export class Catalogo {
  /** Servicio que permite comprobar la sesión y los privilegios antes de modificar stock. */
  private readonly auth = inject(Auth);
  /** Copia reactiva del catálogo inicial con el stock de esta instancia. */
  private readonly estado = signal(JUEGOS.map(j => ({...j})));
  /** Señal de solo lectura del inventario actual. */
  readonly juegos = this.estado.asReadonly();
  /**
   * Reemplaza el stock de un juego existente; un identificador desconocido no modifica el inventario.
   * @param id Identificador del juego.
   * @param stock Cantidad entera entre 0 y 9999.
   * @throws Si el usuario no es administrador o el stock no es válido.
   */
  actualizarStock(id: string, stock: number): void {
    if (!this.auth.esAdmin()) throw new Error('Solo el administrador puede modificar el stock.');
    if (!Number.isInteger(stock) || stock < 0 || stock > 9999) throw new Error('Ingresa un stock entero entre 0 y 9999.');
    this.estado.update(js => js.map(j => j.id === id ? {...j, stock} : j));
  }
  /**
   * Valida todas las líneas antes de descontar unidades del inventario para la compra simulada.
   * @param lineas Productos distintos con cantidades enteras positivas.
   * @throws Si no hay sesión, la lista está vacía, hay duplicados o falta stock.
   */
  descontar(lineas: {id: string; cantidad: number}[]): void {
    if (!this.auth.usuario()) throw new Error('Inicia sesión para comprar.');
    if (!lineas.length || new Set(lineas.map(l => l.id)).size !== lineas.length || lineas.some(l => !Number.isInteger(l.cantidad) || l.cantidad < 1 || !this.estado().some(j => j.id === l.id && j.stock >= l.cantidad))) throw new Error('El stock cambió. Revisa tu carrito antes de pagar.');
    this.estado.update(js => js.map(j => ({...j, stock:j.stock - (lineas.find(l => l.id === j.id)?.cantidad ?? 0)})));
  }
}
