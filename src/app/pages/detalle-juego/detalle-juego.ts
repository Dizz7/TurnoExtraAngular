import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JUEGOS } from '../../data/juegos';
import { CATEGORIAS } from '../../data/categorias';
import type { Juego } from '../../models/juego';
import { PrecioJuego } from '../../components/precio-juego/precio-juego';
import { CarritoDemo } from '../../services/carrito-demo';

@Component({
  selector: 'app-detalle-juego',
  imports: [RouterLink, PrecioJuego],
  templateUrl: './detalle-juego.html',
  styleUrls: ['../../styles/page.css', './detalle-juego.css']
})
export class DetalleJuego {
  readonly juego = signal<Juego | undefined>(undefined);
  readonly categorias = CATEGORIAS;
  readonly carrito = inject(CarritoDemo);

  constructor() {
    // Reutiliza la misma página incluso al navegar entre dos juegos.
    inject(ActivatedRoute).paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      this.juego.set(JUEGOS.find(juego => juego.id === params.get('id')));
    });
  }
}
