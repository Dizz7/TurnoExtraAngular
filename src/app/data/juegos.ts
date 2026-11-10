
 // Modelo de datos para los juegos de TurnoExtra.
import type { CategoriaId } from './categorias';

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

// Catálogo inicial recuperado de la Experiencia 1.
export const JUEGOS: Juego[] = [
  {
    id: 'wingspan',
    nombre: 'Wingspan',
    categoria: 'estrategia',
    descripcion: 'Atrae aves a tu reserva natural, desarrolla combinaciones estratégicas y consigue la mayor cantidad de puntos.',
    precio: 54990,
    anterior: 0,
    imagen: 'img/juegos/wingspan.png',
    stock: 10
  },
  {
    id: 'kurruf',
    nombre: 'Kurrüf',
    categoria: 'estrategia',
    descripcion: 'Explora la selva patagónica chilena y descubre cómo se conecta su biodiversidad. Un juego que te invita a mirar la naturaleza desde una perspectiva diferente.',
    precio: 25490,
    anterior: 29990,
    imagen: 'img/juegos/kurruf.png',
    stock: 10
  },
  {
    id: 'catan',
    nombre: 'Catan',
    categoria: 'estrategia',
    descripcion: 'Recolecta recursos, construye caminos y poblados, e intercambia materiales para conquistar la isla de Catan.',
    precio: 39990,
    anterior: 0,
    imagen: 'img/juegos/catan.png',
    stock: 10
  },
  {
    id: 'exploding-kittens',
    nombre: 'Exploding Kittens',
    categoria: 'familiares',
    descripcion: 'Roba cartas, esquiva a los gatos explosivos y usa tus mejores trucos para seguir en juego. Cada turno puede traer una sorpresa.',
    precio: 19990,
    anterior: 0,
    imagen: 'img/juegos/exploding-kittens.png',
    stock: 10
  },
  {
    id: 'dobble',
    nombre: 'Dobble',
    categoria: 'familiares',
    descripcion: 'Encuentra el símbolo que se repite entre dos cartas antes que los demás. Pon a prueba tu atención y tus reflejos en cada partida.',
    precio: 11992,
    anterior: 14990,
    imagen: 'img/juegos/dobble.png',
    stock: 10
  },
  {
    id: 'sushi-go',
    nombre: 'Sushi Go!',
    categoria: 'familiares',
    descripcion: 'Elige tus platos favoritos y pasa las cartas para crear la mejor combinación de sushi. Reúne puntos y prepara un menú ganador.',
    precio: 16990,
    anterior: 0,
    imagen: 'img/juegos/sushi-go.png',
    stock: 10
  },
  {
    id: 'story-cubes',
    nombre: 'Story Cubes',
    categoria: 'creatividad',
    descripcion: 'Lanza los dados y conecta sus imágenes para inventar una historia. Personajes, lugares y aventuras cobran vida con tu imaginación.',
    precio: 12990,
    anterior: 0,
    imagen: 'img/juegos/story-cubes.png',
    stock: 10
  },
  {
    id: 'pictionary',
    nombre: 'Pictionary',
    categoria: 'creatividad',
    descripcion: 'Convierte palabras en dibujos y ayuda a tu equipo a adivinarlas antes de que termine el tiempo. ¡Cada trazo puede ser la pista clave!',
    precio: 19992,
    anterior: 24990,
    imagen: 'img/juegos/pictionary.png',
    stock: 10
  },
  {
    id: 'telestrations',
    nombre: 'Telestrations',
    categoria: 'creatividad',
    descripcion: 'Dibuja, pasa tu cuaderno y descubre cómo interpretan tu idea los demás. Las palabras se transforman en dibujos y los malentendidos en risas.',
    precio: 27990,
    anterior: 0,
    imagen: 'img/juegos/telestrations.png',
    stock: 10
  },
  {
    id: 'dixit',
    nombre: 'Dixit',
    categoria: 'fiesta',
    descripcion: 'Imagina una pista para tu carta y descubre cómo la interpretan los demás. Un juego de ilustraciones e historias donde cada mirada cuenta.',
    precio: 29990,
    anterior: 0,
    imagen: 'img/juegos/dixit.png',
    stock: 10
  },
  {
    id: 'codigo-secreto',
    nombre: 'Código Secreto',
    categoria: 'fiesta',
    descripcion: 'Conecta palabras con una sola pista y guía a tu equipo hacia sus agentes. Descifra las claves y evita al asesino para conseguir la victoria.',
    precio: 19992,
    anterior: 24990,
    imagen: 'img/juegos/codigo-secreto.png',
    stock: 10
  },
  {
    id: 'just-one',
    nombre: 'Just One',
    categoria: 'fiesta',
    descripcion: 'Escribe una pista para ayudar a adivinar la palabra secreta. Las pistas repetidas se eliminan, así que piensa diferente y colabora con el grupo.',
    precio: 21990,
    anterior: 0,
    imagen: 'img/juegos/just-one.png',
    stock: 10
  }
];
