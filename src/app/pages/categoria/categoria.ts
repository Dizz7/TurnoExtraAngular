import { FormsModule } from '@angular/forms';

import { Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CATEGORIAS, CategoriaId } from '../../data/categorias';
import { Catalogo } from '../../services/catalogo';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { CarritoDemo } from '../../services/carrito-demo';
import { TarjetaJuego } from '../../components/tarjeta-juego/tarjeta-juego';

/** Catálogo reutilizado por las cuatro categorías, con búsqueda independiente mediante ngModel. */
@Component({
  selector: 'app-categoria',
  imports: [NgFor, NgIf, RouterLink, TarjetaJuego, FormsModule],
  templateUrl: './categoria.html',
  styleUrls: ['../../styles/page.css', './categoria.css'],
})
export class Categoria implements OnInit {
  /** Textos y estilo visual de la categoría activa; inicialmente estrategia. */
  categoria = CATEGORIAS.estrategia;
  /** Texto del buscador independiente de los formularios reactivos. */
  busqueda = '';
  /** Juegos de la categoría cuyo nombre o descripción coincide con la búsqueda normalizada. */
  get juegosFiltrados() {
    const termino = this.normalizar(this.busqueda);
    return this.juegos.filter((j) =>
      this.normalizar(j.nombre + ' ' + j.descripcion).includes(termino),
    );
  }
  /**
   * Elimina espacios externos y marcas diacríticas, y convierte a minúsculas.
   * @param texto Texto original del buscador o del juego.
   * @returns Texto comparable sin diferencias de mayúsculas o tildes.
   */
  private normalizar(texto: string): string {
    return texto
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
  /** Inventario compartido con disponibilidad actualizada durante la navegación. */
  private readonly catalogo = inject(Catalogo);
  /** Identificador reactivo de la categoría actual. */
  private readonly id = signal<CategoriaId>('estrategia');
  /** Ciclo de vida usado para liberar la suscripción a datos de ruta. */
  private readonly destroyRef = inject(DestroyRef);
  /** Juegos del inventario que pertenecen a la categoría activa. */
  get juegos() {
    return this.catalogo.juegos().filter((j) => j.categoria === this.id());
  }

  /**
   * Recibe la ruta cuyos datos identifican la categoría.
   * @param route Ruta activada por Angular Router.
   */
  constructor(private route: ActivatedRoute) {}

  /** Escucha los datos de ruta, actualiza la categoría y reinicia la búsqueda al navegar. */
  ngOnInit(): void {
    // Escuchar los cambios de ruta para reutilizar el componente.
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((datos) => {
      const id = datos['categoria'] as CategoriaId;

      this.categoria = CATEGORIAS[id];
      this.id.set(id);
      this.busqueda = '';
    });
  }

  /** Estado compartido del carrito temporal de la aplicación. */
  readonly carrito = inject(CarritoDemo);

  /** Cantidad total de unidades del carrito compartido. */
  get cantidadCarrito(): number {
    return this.carrito.cantidadCarrito();
  }
  /** Nombre del último juego agregado al carrito compartido. */
  get ultimoJuegoAgregado(): string {
    return this.carrito.ultimoJuegoAgregado();
  }

  /**
   * Recibe el evento de la tarjeta y delega la incorporación al carrito.
   * @param juego Producto seleccionado por el componente hijo.
   */
  recibirJuego(juego: import('../../models/juego').Juego): void {
    this.carrito.agregar(juego);
  }
}
