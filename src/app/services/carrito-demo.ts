import { Injectable, computed, signal } from '@angular/core';
import type { Juego } from '../models/juego';
/** Producto y cantidad de una línea del carrito temporal. */
export interface LineaCarrito {
  /** Copia del producto con el precio y stock conocidos al agregarlo. */
  juego: Juego;
  /** Número de unidades seleccionadas para el producto. */
  cantidad: number;
}
/** Carrito en memoria, reiniciado al recargar y vaciado al salir o completar el pago simulado. */
@Injectable({ providedIn: 'root' })
export class CarritoDemo {
  /** Líneas internas con una copia del producto y su cantidad. */
  private readonly estado = signal<LineaCarrito[]>([]);
  /** Nombre interno del último producto agregado. */
  private readonly ultimo = signal('');
  /** Señal de solo lectura de las líneas del carrito. */
  readonly lineas = this.estado.asReadonly();
  /** Suma reactiva de unidades de todas las líneas. */
  readonly cantidadCarrito = computed(() => this.estado().reduce((n, l) => n + l.cantidad, 0));
  /** Importe total en pesos según precio y cantidad almacenados en cada línea. */
  readonly total = computed(() => this.estado().reduce((n, l) => n + l.cantidad * l.juego.precio, 0));
  /** Nombre del último juego agregado; vacío al vaciar el carrito. */
  readonly ultimoJuegoAgregado = this.ultimo.asReadonly();
  /**
   * Agrega una unidad o incrementa la línea existente sin superar el stock recibido.
   * @param juego Producto con el precio y disponibilidad actuales.
   */
  agregar(juego: Juego): void {
    const actual = this.estado().find(l => l.juego.id === juego.id);
    if (juego.stock <= 0 || (actual?.cantidad ?? 0) >= juego.stock) return;
    this.estado.update(ls => actual ? ls.map(l => l.juego.id === juego.id ? { juego: {...juego}, cantidad: l.cantidad+1 } : l) : [...ls, { juego: {...juego}, cantidad: 1 }]);
    this.ultimo.set(juego.nombre);
  }
  /**
   * Cambia la cantidad solo si es un entero positivo que no supera el stock guardado en la línea.
   * @param id Identificador del producto del carrito.
   * @param cantidad Nueva cantidad; los valores inválidos se ignoran.
   */
  cambiar(id: string, cantidad: number): void {
    const linea = this.estado().find(l => l.juego.id === id);
    if (!linea || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > linea.juego.stock) return;
    this.estado.update(ls => ls.map(l => l.juego.id === id ? {...l, cantidad} : l));
  }
  /**
   * Elimina una línea y limpia el último nombre si el carrito queda vacío.
   * @param id Identificador del producto que se retirará.
   */
  quitar(id: string): void { this.estado.update(ls => ls.filter(l => l.juego.id !== id)); if (!this.estado().length) this.ultimo.set(''); }
  /** Elimina todas las líneas y restablece el nombre del último juego. */
  vaciar(): void { this.estado.set([]); this.ultimo.set(''); }
}
