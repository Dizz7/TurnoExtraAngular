
import { Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CATEGORIAS, CategoriaId } from '../../data/categorias';
import { Catalogo } from '../../services/catalogo';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
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
  private readonly catalogo = inject(Catalogo);
  private readonly id = signal<CategoriaId>('estrategia');
  private readonly destroyRef = inject(DestroyRef);
  get juegos() { return this.catalogo.juegos().filter(j => j.categoria === this.id()); }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Escuchar los cambios de ruta para reutilizar el componente.
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(datos => {
      const id = datos['categoria'] as CategoriaId;

      this.categoria = CATEGORIAS[id];
      this.id.set(id);
    });
  }


  readonly carrito = inject(CarritoDemo);

  get cantidadCarrito(): number { return this.carrito.cantidadCarrito(); }
  get ultimoJuegoAgregado(): string { return this.carrito.ultimoJuegoAgregado(); }

  recibirJuego(juego: import('../../models/juego').Juego): void { this.carrito.agregar(juego); }
}
