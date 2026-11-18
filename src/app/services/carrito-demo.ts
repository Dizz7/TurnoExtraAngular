import { Injectable, signal } from '@angular/core';
import type { Juego } from '../models/juego';

// Estado de demostración compartido entre catálogo y detalle; no procesa compras.
@Injectable({ providedIn: 'root' })
export class CarritoDemo {
  private readonly cantidad = signal(0);
  private readonly ultimo = signal('');
  readonly cantidadCarrito = this.cantidad.asReadonly();
  readonly ultimoJuegoAgregado = this.ultimo.asReadonly();

  agregar(juego: Juego): void {
    if (juego.stock <= 0) return;
    this.cantidad.update(cantidad => cantidad + 1);
    this.ultimo.set(juego.nombre);
  }
}
