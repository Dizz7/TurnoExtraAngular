
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Juego } from '../../data/juegos';
import { RouterLink } from '@angular/router';
import { PrecioJuego } from '../precio-juego/precio-juego';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tarjeta-juego',
  imports: [NgIf, RouterLink, PrecioJuego],
  templateUrl: './tarjeta-juego.html',
  styleUrls: ['../../styles/card-reveal.css', './tarjeta-juego.css']
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
}
