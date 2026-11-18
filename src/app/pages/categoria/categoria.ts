
import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CATEGORIAS, CategoriaId } from '../../data/categorias';
import { JUEGOS, Juego } from '../../data/juegos';
import { CarritoDemo } from '../../services/carrito-demo';
import { TarjetaJuego } from '../../components/tarjeta-juego/tarjeta-juego';

@Component({
  selector: 'app-categoria',
  imports: [NgFor, NgIf, RouterLink, TarjetaJuego],
  templateUrl: './categoria.html',
  styleUrls: ['../../styles/page.css', './categoria.css']
})
export class Categoria implements OnInit {

  categoria = CATEGORIAS.estrategia;
  juegos: Juego[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Escuchar los cambios de ruta para reutilizar el componente.
    this.route.data.subscribe(datos => {
      const id = datos['categoria'] as CategoriaId;

      this.categoria = CATEGORIAS[id];
      this.juegos = JUEGOS.filter(juego => juego.categoria === id);
    });
  }


  readonly carrito = inject(CarritoDemo);

  get cantidadCarrito(): number { return this.carrito.cantidadCarrito(); }
  get ultimoJuegoAgregado(): string { return this.carrito.ultimoJuegoAgregado(); }

  recibirJuego(juego: Juego): void { this.carrito.agregar(juego); }
}
