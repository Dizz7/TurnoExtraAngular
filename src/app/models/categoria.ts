
export type CategoriaId =
  | 'estrategia'
  | 'familiares'
  | 'creatividad'
  | 'fiesta';

export interface Categoria {
  nombre: string;
  frase: string;
  titulo: string;
  descripcion: string;
  subtitulo: string;
  estilo: string;
  icono: string;
  pieza: string;
}

export interface CategoriaInicio {
  id: CategoriaId;
  nombre: string;
  descripcion: string;
  clase: string;
  imagenes: {
    ruta: string;
    nombre: string;
  }[];
}
