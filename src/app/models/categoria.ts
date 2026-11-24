
/** Identificadores admitidos para las cuatro categorías y sus rutas. */
export type CategoriaId =
  | 'estrategia'
  | 'familiares'
  | 'creatividad'
  | 'fiesta';

/** Textos y recursos visuales compartidos de una categoría del catálogo. */
export interface Categoria {
  /** Nombre visible de la categoría. */
  nombre: string;
  /** Lema de la cabecera de categoría. */
  frase: string;
  /** Título principal de la presentación. */
  titulo: string;
  /** Descripción introductoria del catálogo. */
  descripcion: string;
  /** Invitación breve a explorar los juegos. */
  subtitulo: string;
  /** Clase CSS asociada a la paleta de la categoría. */
  estilo: string;
  /** Símbolo representativo de la categoría. */
  icono: string;
  /** Símbolo decorativo de juego utilizado en la presentación. */
  pieza: string;
}

/** Datos de una tarjeta de categoría de la portada. */
export interface CategoriaInicio {
  /** Identificador de categoría utilizado en la ruta. */
  id: CategoriaId;
  /** Nombre visible de la categoría. */
  nombre: string;
  /** Texto breve de la tarjeta de portada. */
  descripcion: string;
  /** Clase CSS que identifica el estilo visual de la categoría. */
  clase: string;
  /** Imágenes seleccionadas del catálogo con ruta y nombre del juego. */
  imagenes: {
    ruta: string;
    nombre: string;
  }[];
}
