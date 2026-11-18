
import type { CategoriaId } from './categoria';

export interface Juego {
  id: string;
  nombre: string;
  categoria: CategoriaId;
  descripcion: string;
  precio: number;
  anterior: number;
  imagen: string;
  stock: number;
}
