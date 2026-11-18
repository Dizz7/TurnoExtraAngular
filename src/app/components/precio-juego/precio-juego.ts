import { Component, Input } from '@angular/core';
import type { Juego } from '../../models/juego';

@Component({
  selector: 'app-precio-juego',
  templateUrl: './precio-juego.html',
  styleUrl: './precio-juego.css'
})
export class PrecioJuego {
  @Input({ required: true }) juego!: Juego;

  get descuento(): number {
    return this.juego.anterior > this.juego.precio
      ? Math.round(100 * (1 - this.juego.precio / this.juego.anterior)) : 0;
  }

  formatearPrecio(precio: number): string {
    return '$' + precio.toLocaleString('es-CL');
  }
}
