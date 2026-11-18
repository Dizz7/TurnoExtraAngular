
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface CategoriaInicio {
  id: string;
  nombre: string;
  descripcion: string;
  clase: string;
  imagenes: {
    ruta: string;
    nombre: string;
  }[];
}

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {

  categorias: CategoriaInicio[] = [
    {
      id: 'estrategia',
      nombre: 'Estrategia',
      descripcion: 'Planifica, conquista y gana.',
      clase: 'strategy',
      imagenes: [
        { ruta: 'img/juegos/wingspan.png', nombre: 'Wingspan' },
        { ruta: 'img/juegos/catan.png', nombre: 'Catan' },
        { ruta: 'img/juegos/kurruf.png', nombre: 'Kurruf' }
      ]
    },
    {
      id: 'familiares',
      nombre: 'Familiares',
      descripcion: 'Comparte partidas en familia.',
      clase: 'family',
      imagenes: [
        { ruta: 'img/juegos/exploding-kittens.png', nombre: 'Exploding Kittens' },
        { ruta: 'img/juegos/dobble.png', nombre: 'Dobble' },
        { ruta: 'img/juegos/sushi-go.png', nombre: 'Sushi Go!' }
      ]
    },
    {
      id: 'creatividad',
      nombre: 'Creatividad',
      descripcion: 'Imagina, crea y sorprende.',
      clase: 'creativity',
      imagenes: [
        { ruta: 'img/juegos/pictionary.png', nombre: 'Pictionary' },
        { ruta: 'img/juegos/story-cubes.png', nombre: 'Story Cubes' },
        { ruta: 'img/juegos/telestrations.png', nombre: 'Telestrations' }
      ]
    },
    {
      id: 'fiesta',
      nombre: 'Fiesta',
      descripcion: 'Ríe, juega y celebra.',
      clase: 'party',
      imagenes: [
        { ruta: 'img/juegos/codigo-secreto.png', nombre: 'Código Secreto' },
        { ruta: 'img/juegos/dixit.png', nombre: 'Dixit' },
        { ruta: 'img/juegos/just-one.png', nombre: 'Just One' }
      ]
    }
  ];
}
