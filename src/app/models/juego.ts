
import type { CategoriaId } from './categoria';

/** Producto del catálogo con precio en pesos chilenos y disponibilidad. */
export interface Juego {
  /** Identificador usado en rutas, inventario y carrito. */
  id: string;
  /** Nombre comercial del juego. */
  nombre: string;
  /** Categoría a la que pertenece el producto. */
  categoria: CategoriaId;
  /** Descripción breve presentada en catálogo y detalle. */
  descripcion: string;
  /** Precio vigente en pesos chilenos. */
  precio: number;
  /** Precio anterior de referencia; solo produce descuento si supera el precio actual. */
  anterior: number;
  /** Ruta de la imagen del juego servida por la aplicación. */
  imagen: string;
  /** Unidades disponibles para agregar al carrito o comprar. */
  stock: number;
}
