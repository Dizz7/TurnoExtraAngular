import { Component, Input } from '@angular/core';
import type { Juego } from '../../models/juego';

/** Presentación reutilizable del precio actual, precio anterior y descuento de un juego. */
@Component({
  selector: 'app-precio-juego',
  templateUrl: './precio-juego.html',
  styleUrl: './precio-juego.css'
})
export class PrecioJuego {
  /** Entrada obligatoria con los precios del juego mostrado. */
  @Input({ required: true }) juego!: Juego;

  /** Porcentaje de descuento redondeado; devuelve cero si el precio anterior no es mayor. */
  get descuento(): number {
    return this.juego.anterior > this.juego.precio
      ? Math.round(100 * (1 - this.juego.precio / this.juego.anterior)) : 0;
  }

  /**
   * Formatea un precio para su presentación en pesos chilenos.
   * @param precio Importe del catálogo.
   * @returns Texto con símbolo de peso y separadores de es-CL.
   */
  formatearPrecio(precio: number): string {
    return '$' + precio.toLocaleString('es-CL');
  }
}
