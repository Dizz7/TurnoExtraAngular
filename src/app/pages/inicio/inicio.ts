
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CATEGORIAS } from '../../data/categorias';
import { JUEGOS } from '../../data/juegos';

import type {
  CategoriaId,
  CategoriaInicio
} from '../../models/categoria';

/** Portada con tarjetas de categorías derivadas de los datos del catálogo. */
@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrls: ['../../styles/page.css', '../../styles/card-reveal.css', './inicio.css']
})
export class Inicio {

  /** Textos breves exclusivos de las tarjetas de la portada. */
  private readonly descripciones: Record<CategoriaId, string> = {
    estrategia: 'Planifica, conquista y gana.',
    familiares: 'Comparte partidas en familia.',
    creatividad: 'Imagina, crea y sorprende.',
    fiesta: 'Ríe, juega y celebra.'
  };

  /** Tarjetas de inicio con metadatos y hasta tres imágenes por categoría. */
  categorias: CategoriaInicio[] = (
    Object.keys(CATEGORIAS) as CategoriaId[]
  ).map(id => ({
    id,
    nombre: CATEGORIAS[id].nombre,
    descripcion: this.descripciones[id],
    clase: CATEGORIAS[id].estilo,

    imagenes: JUEGOS
      .filter(juego => juego.categoria === id)
      .slice(0, 3)
      .map(juego => ({
        ruta: juego.imagen,
        nombre: juego.nombre
      }))
  }));
}
