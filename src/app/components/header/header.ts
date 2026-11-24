import { Component, ElementRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth } from '../../services/auth';
import { CarritoDemo } from '../../services/carrito-demo';
import { CATEGORIAS } from '../../data/categorias';

/** Navegación responsive y desplegable accesible controlados por Angular. */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: { '(document:click)': 'cerrarFuera($event)', '(focusout)': 'salidaDeFoco($event)' },
})
export class Header {
  readonly auth = inject(Auth);
  readonly carrito = inject(CarritoDemo);
  readonly menuAbierto = signal(false);
  readonly categoriasAbiertas = signal(false);
  readonly categorias = Object.entries(CATEGORIAS).map(([id, categoria]) => ({
    id,
    nombre: categoria.nombre,
  }));
  private readonly router = inject(Router);
  private readonly elemento = inject(ElementRef<HTMLElement>);
  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((evento) => {
      if (evento instanceof NavigationEnd) this.cerrarMenus();
    });
  }
  alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
    if (!this.menuAbierto()) this.categoriasAbiertas.set(false);
  }
  cerrarMenus(): void {
    this.menuAbierto.set(false);
    this.categoriasAbiertas.set(false);
  }
  cerrarFuera(evento: MouseEvent): void {
    if (evento.target instanceof Node && !this.elemento.nativeElement.contains(evento.target))
      this.cerrarMenus();
  }
  salidaDeFoco(evento: FocusEvent): void {
    if (
      evento.relatedTarget instanceof Node &&
      !this.elemento.nativeElement.contains(evento.relatedTarget)
    )
      this.cerrarMenus();
  }
  cerrarCategorias(evento: Event, boton: HTMLButtonElement): void {
    evento.stopPropagation();
    this.categoriasAbiertas.set(false);
    boton.focus();
  }
  cerrarConEscape(boton: HTMLButtonElement): void {
    this.cerrarMenus();
    if (boton.offsetParent !== null) boton.focus();
  }
  salir(): void {
    this.auth.salir();
    this.cerrarMenus();
    void this.router.navigateByUrl('/login');
  }
}
