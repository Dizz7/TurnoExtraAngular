import { Login } from './pages/login/login';
import { Recuperar } from './pages/recuperar/recuperar';
import { Perfil } from './pages/perfil/perfil';
import { Carrito } from './pages/carrito/carrito';
import { Pago } from './pages/pago/pago';
import { Admin } from './pages/admin/admin';
import { SinAcceso } from './pages/sin-acceso/sin-acceso';
import { acceso, administrador } from './guards/acceso';

import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { Categoria } from './pages/categoria/categoria';
import { DetalleJuego } from './pages/detalle-juego/detalle-juego';
import { Registro } from './pages/registro/registro';

export const routes: Routes = [
  { path: '', component: Inicio },

  { path: 'estrategia', component: Categoria, data: { categoria: 'estrategia' } },
  { path: 'familiares', component: Categoria, data: { categoria: 'familiares' } },
  { path: 'creatividad', component: Categoria, data: { categoria: 'creatividad' } },
  { path: 'fiesta', component: Categoria, data: { categoria: 'fiesta' } },

  { path: 'juegos/:id', component: DetalleJuego },

  { path: 'registro', component: Registro },
  { path: 'login', component: Login },
  { path: 'recuperar', component: Recuperar },
  { path: 'perfil', component: Perfil, canActivate: [acceso] },
  { path: 'carrito', component: Carrito },
  { path: 'pago', component: Pago, canActivate: [acceso] },
  { path: 'admin', component: Admin, canActivate: [acceso, administrador] },
  { path: 'sin-acceso', component: SinAcceso },
  { path: '**', redirectTo: '' }
];
