import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Catalogo } from '../../services/catalogo';
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

  private readonly catalogo = inject(Catalogo);
  private readonly id = signal<string | null>(null);

  constructor() {
    effect(() => this.juego.set(this.catalogo.juegos().find(j => j.id === this.id())));
    // Reutiliza la misma página incluso al navegar entre dos juegos.
    inject(ActivatedRoute).paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      this.id.set(params.get('id'));
      this.juego.set(this.catalogo.juegos().find(j => j.id === this.id()));
    });
  }
}
