import type { Categoria, CategoriaId } from '../models/categoria';



/** Metadatos visuales de las cuatro categorías, indexados por su identificador. */
export const CATEGORIAS: Record<CategoriaId, Categoria> = {
  estrategia: {
    nombre: 'Estrategia',
    frase: 'PIENSA. PLANIFICA. CONQUISTA.',
    titulo: 'Cada jugada cuenta.',
    descripcion: 'Descubre nuestra selección de juegos de estrategia. Planifica tus movimientos, toma decisiones y disfruta de cada partida.',
    subtitulo: 'Encuentra tu próximo desafío.',
    estilo: 'strategy',
    icono: '♟',
    pieza: '🎲'
  },
  familiares: {
    nombre: 'Familiares',
    frase: 'COMPARTE. RÍE. REPITE.',
    titulo: 'La diversión se comparte.',
    descripcion: 'Descubre nuestra selección de juegos familiares. Reúne a tus personas favoritas, prepara la mesa y disfruta de una partida juntos.',
    subtitulo: 'Encuentra una nueva excusa para reunirse.',
    estilo: 'family',
    icono: '🏠',
    pieza: '🃏'
  },
  creatividad: {
    nombre: 'Creatividad',
    frase: 'IMAGINA. CREA. SORPRENDE.',
    titulo: 'Tus ideas entran en juego.',
    descripcion: 'Descubre nuestra selección de juegos creativos. Inventa historias, dibuja lo inesperado y deja que tu imaginación guíe la partida.',
    subtitulo: 'Cada idea puede empezar una gran historia.',
    estilo: 'creativity',
    icono: '🎨',
    pieza: '✏️'
  },
  fiesta: {
    nombre: 'Fiesta',
    frase: 'REÚNE. SORPRENDE. CELEBRA.',
    titulo: 'La fiesta empieza jugando.',
    descripcion: 'Descubre nuestra selección de juegos para compartir. Reúne a tus amigos, rompe el hielo y convierte cualquier encuentro en una buena historia.',
    subtitulo: 'La mejor excusa para una ronda más.',
    estilo: 'party',
    icono: '🎉',
    pieza: '🎲'
  }
};

export type { CategoriaId } from '../models/categoria';
