
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CATEGORIAS, CategoriaId } from '../../data/categorias';
import { JUEGOS, Juego } from '../../data/juegos';

@Component({
  selector: 'app-categoria',
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css'
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

  // Formatear los precios en pesos chilenos.
  formatearPrecio(precio: number): string {
    return '$' + precio.toLocaleString('es-CL');
  }


  // Calcular el porcentaje de descuento de un juego.
  calcularDescuento(juego: Juego): number {
    if (juego.anterior <= juego.precio) {
      return 0;
    }

    return Math.round(100 * (1 - juego.precio / juego.anterior));
  }
}
