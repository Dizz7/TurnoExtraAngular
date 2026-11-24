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
  /** Servicio de cuentas y sesión local utilizado por esta vista. */
  readonly auth = inject(Auth);
  /** Estado compartido del carrito temporal de la aplicación. */
  readonly carrito = inject(CarritoDemo);
  /** Estado de apertura del menú móvil. */
  readonly menuAbierto = signal(false);
  /** Estado de apertura del desplegable de categorías. */
  readonly categoriasAbiertas = signal(false);
  /** Identificadores y nombres de las cuatro categorías usados para construir enlaces. */
  readonly categorias = Object.entries(CATEGORIAS).map(([id, categoria]) => ({
    id,
    nombre: categoria.nombre,
  }));
  /** Router utilizado para navegar entre pantallas de la aplicación. */
  private readonly router = inject(Router);
  /** Referencia al encabezado para detectar clics y cambios de foco externos. */
  private readonly elemento = inject(ElementRef<HTMLElement>);
  /** Cierra los menús al terminar una navegación y libera la suscripción al destruirse. */
  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((evento) => {
      if (evento instanceof NavigationEnd) this.cerrarMenus();
    });
  }
  /** Alterna el menú móvil y cierra las categorías cuando se oculta. */
  alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
    if (!this.menuAbierto()) this.categoriasAbiertas.set(false);
  }
  /** Cierra tanto el menú móvil como el desplegable de categorías. */
  cerrarMenus(): void {
    this.menuAbierto.set(false);
    this.categoriasAbiertas.set(false);
  }
  /**
   * Cierra los menús cuando el clic ocurre fuera del encabezado.
   * @param evento Clic propagado desde el documento.
   */
  cerrarFuera(evento: MouseEvent): void {
    if (evento.target instanceof Node && !this.elemento.nativeElement.contains(evento.target))
      this.cerrarMenus();
  }
  /**
   * Cierra los menús si el nuevo foco pertenece a un nodo externo al encabezado.
   * @param evento Cambio de foco recibido por el encabezado.
   */
  salidaDeFoco(evento: FocusEvent): void {
    if (
      evento.relatedTarget instanceof Node &&
      !this.elemento.nativeElement.contains(evento.relatedTarget)
    )
      this.cerrarMenus();
  }
  /**
   * Cierra las categorías, detiene la propagación y devuelve el foco al botón.
   * @param evento Evento de teclado que solicita el cierre.
   * @param boton Disparador del desplegable al que volverá el foco.
   */
  cerrarCategorias(evento: Event, boton: HTMLButtonElement): void {
    evento.stopPropagation();
    this.categoriasAbiertas.set(false);
    boton.focus();
  }
  /**
   * Cierra ambos menús y devuelve el foco al botón móvil si está visible.
   * @param boton Disparador del menú móvil.
   */
  cerrarConEscape(boton: HTMLButtonElement): void {
    this.cerrarMenus();
    if (boton.offsetParent !== null) boton.focus();
  }
  /** Cierra la sesión y los menús, vacía el carrito mediante Auth y navega al login. */
  salir(): void {
    this.auth.salir();
    this.cerrarMenus();
    void this.router.navigateByUrl('/login');
  }
}
