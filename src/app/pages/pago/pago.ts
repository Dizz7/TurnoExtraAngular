import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarritoDemo } from '../../services/carrito-demo';
import { Catalogo } from '../../services/catalogo';
import { Auth } from '../../services/auth';
/** Confirmación exclusivamente simulada; no solicita datos bancarios ni genera cobros. */
@Component({selector:'app-pago', imports:[ReactiveFormsModule, RouterLink], templateUrl:'./pago.html', styleUrl:'../../styles/cuenta.css'})
export class Pago {
  readonly carrito=inject(CarritoDemo); private readonly catalogo=inject(Catalogo); readonly auth=inject(Auth);
  acepto=new FormControl(false,{nonNullable:true, validators:Validators.requiredTrue});
  formulario = new FormGroup({acepto:this.acepto});
  error=''; comprobante?: {folio:string; total:number; unidades:number};
  precio(n:number):string { return '$'+n.toLocaleString('es-CL'); }
  pagar():void {
    if(this.comprobante) return;
    this.error=''; this.acepto.markAsTouched();
    if(!this.auth.usuario()) { this.error='Inicia sesión para comprar.'; return; }
    if(!this.carrito.lineas().length) { this.error='El carrito está vacío.'; return; }
    if(this.acepto.invalid) { this.error='Confirma que entiendes que el pago es simulado.'; return; }
    try {
      const comprobante={folio:'DEMO-'+crypto.randomUUID().slice(0,8).toUpperCase(), total:this.carrito.total(), unidades:this.carrito.cantidadCarrito()};
      this.catalogo.descontar(this.carrito.lineas().map(l => ({id:l.juego.id,cantidad:l.cantidad})));
      this.comprobante=comprobante; this.carrito.vaciar();
    } catch(e) { this.error=e instanceof Error ? e.message : 'No se pudo completar la compra.'; }
  }
}
