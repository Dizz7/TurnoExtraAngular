
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Juego } from '../../data/juegos';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tarjeta-juego',
  imports: [NgIf],
  templateUrl: './tarjeta-juego.html',
  styleUrl: './tarjeta-juego.css'
})
export class TarjetaJuego {

  // Recibir un juego desde el componente padre.
  @Input({ required: true }) juego!: Juego;

  // Comunicación hijo → padre.
  @Output() agregarCarrito = new EventEmitter<Juego>();

  // Notificar al padre cuando se selecciona un juego.
  agregarAlCarrito(): void {
    if (this.juego.stock > 0) {
      this.agregarCarrito.emit(this.juego);
    }
  }


  // Calcular el porcentaje de descuento.
  calcularDescuento(): number {
    if (this.juego.anterior <= this.juego.precio) {
      return 0;
    }

    return Math.round(
      100 * (1 - this.juego.precio / this.juego.anterior)
    );
  }

  // Formatear precios en pesos chilenos.
  formatearPrecio(precio: number): string {
    return '$' + precio.toLocaleString('es-CL');
  }
}
