import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({selector:'app-sin-acceso', imports:[RouterLink], template:`<section class="account-page"><div class="account-card"><h1>Acceso restringido</h1><p>Esta sección está disponible solo para administradores.</p><a routerLink="/">Volver al inicio</a></div></section>`, styleUrl:'../../styles/cuenta.css'})
export class SinAcceso {}
