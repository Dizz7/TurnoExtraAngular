import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Juego } from '../../data/juegos';
import { RouterLink } from '@angular/router';
import { PrecioJuego } from '../precio-juego/precio-juego';

/** Tarjeta de producto que recibe datos del padre y emite solicitudes para agregar al carrito. */
@Component({
  selector: 'app-tarjeta-juego',
  imports: [RouterLink, PrecioJuego],
  templateUrl: './tarjeta-juego.html',
  styleUrls: ['../../styles/card-reveal.css', './tarjeta-juego.css'],
})
export class TarjetaJuego {
  /** Entrada obligatoria con la información del juego recibida del componente padre. */
  @Input({ required: true }) juego!: Juego;

  /** Evento hijo-padre que entrega el juego seleccionado; el padre actualiza el carrito. */
  @Output() agregarCarrito = new EventEmitter<Juego>();

  /** Emite el juego al padre solo si el stock recibido es mayor que cero. */
  agregarAlCarrito(): void {
    if (this.juego.stock > 0) {
      this.agregarCarrito.emit(this.juego);
    }
  }
}
