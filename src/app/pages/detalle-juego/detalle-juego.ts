import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Catalogo } from '../../services/catalogo';
import { CATEGORIAS } from '../../data/categorias';
import type { Juego } from '../../models/juego';
import { PrecioJuego } from '../../components/precio-juego/precio-juego';
import { CarritoDemo } from '../../services/carrito-demo';

/** Detalle reutilizable que sigue el identificador de ruta y los cambios del inventario. */
@Component({
  selector: 'app-detalle-juego',
  imports: [RouterLink, PrecioJuego],
  templateUrl: './detalle-juego.html',
  styleUrls: ['../../styles/page.css', './detalle-juego.css']
})
export class DetalleJuego {
  /** Juego encontrado en el inventario; undefined indica un identificador inexistente. */
  readonly juego = signal<Juego | undefined>(undefined);
  /** Metadatos de categorías para mostrar el enlace de regreso. */
  readonly categorias = CATEGORIAS;
  /** Estado compartido del carrito temporal de la aplicación. */
  readonly carrito = inject(CarritoDemo);

  /** Inventario compartido con disponibilidad actualizada durante la navegación. */
  private readonly catalogo = inject(Catalogo);
  /** Identificador del juego leído desde el parámetro de ruta. */
  private readonly id = signal<string | null>(null);

  /** Sincroniza el juego con la ruta y el inventario; libera la suscripción al destruirse. */
  constructor() {
    effect(() => this.juego.set(this.catalogo.juegos().find(j => j.id === this.id())));
    // Reutiliza la misma página incluso al navegar entre dos juegos.
    inject(ActivatedRoute).paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      this.id.set(params.get('id'));
      this.juego.set(this.catalogo.juegos().find(j => j.id === this.id()));
    });
  }
}
