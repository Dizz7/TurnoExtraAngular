import { Auth } from '../../services/auth';
import { CarritoDemo } from '../../services/carrito-demo';

import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  readonly auth = inject(Auth);
  readonly carrito = inject(CarritoDemo);
  private readonly router = inject(Router);
  salir(): void { this.auth.salir(); void this.router.navigateByUrl('/login'); }
}
