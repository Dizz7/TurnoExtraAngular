import { Injectable, computed, signal } from '@angular/core';
import type { Juego } from '../models/juego';
export interface LineaCarrito { juego: Juego; cantidad: number; }
/** Carrito temporal. Se vacía al cerrar sesión o completar una compra simulada. */
@Injectable({ providedIn: 'root' })
export class CarritoDemo {
  private readonly estado = signal<LineaCarrito[]>([]);
  private readonly ultimo = signal('');
  readonly lineas = this.estado.asReadonly();
  readonly cantidadCarrito = computed(() => this.estado().reduce((n, l) => n + l.cantidad, 0));
  readonly total = computed(() => this.estado().reduce((n, l) => n + l.cantidad * l.juego.precio, 0));
  readonly ultimoJuegoAgregado = this.ultimo.asReadonly();
  agregar(juego: Juego): void {
    const actual = this.estado().find(l => l.juego.id === juego.id);
    if (juego.stock <= 0 || (actual?.cantidad ?? 0) >= juego.stock) return;
    this.estado.update(ls => actual ? ls.map(l => l.juego.id === juego.id ? { juego: {...juego}, cantidad: l.cantidad+1 } : l) : [...ls, { juego: {...juego}, cantidad: 1 }]);
    this.ultimo.set(juego.nombre);
  }
  cambiar(id: string, cantidad: number): void {
    const linea = this.estado().find(l => l.juego.id === id);
    if (!linea || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > linea.juego.stock) return;
    this.estado.update(ls => ls.map(l => l.juego.id === id ? {...l, cantidad} : l));
  }
  quitar(id: string): void { this.estado.update(ls => ls.filter(l => l.juego.id !== id)); if (!this.estado().length) this.ultimo.set(''); }
  vaciar(): void { this.estado.set([]); this.ultimo.set(''); }
}
