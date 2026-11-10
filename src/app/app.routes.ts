
import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { Estrategia } from './pages/estrategia/estrategia';
import { Familiares } from './pages/familiares/familiares';
import { Creatividad } from './pages/creatividad/creatividad';
import { Fiesta } from './pages/fiesta/fiesta';
import { Registro } from './pages/registro/registro';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'estrategia', component: Estrategia },
  { path: 'familiares', component: Familiares },
  { path: 'creatividad', component: Creatividad },
  { path: 'fiesta', component: Fiesta },
  { path: 'registro', component: Registro },
  { path: '**', redirectTo: '' }
];
