
import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { Categoria } from './pages/categoria/categoria';
import { Registro } from './pages/registro/registro';

export const routes: Routes = [
  { path: '', component: Inicio },

  { path: 'estrategia', component: Categoria, data: { categoria: 'estrategia' } },
  { path: 'familiares', component: Categoria, data: { categoria: 'familiares' } },
  { path: 'creatividad', component: Categoria, data: { categoria: 'creatividad' } },
  { path: 'fiesta', component: Categoria, data: { categoria: 'fiesta' } },

  { path: 'registro', component: Registro },
  { path: '**', redirectTo: '' }
];
