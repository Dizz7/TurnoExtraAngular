import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarritoDemo } from '../../services/carrito-demo';
import { Catalogo } from '../../services/catalogo';
import { Auth } from '../../services/auth';
/** Confirmación exclusivamente simulada; no solicita datos bancarios ni genera cobros. */
@Component({selector:'app-pago', imports:[ReactiveFormsModule, RouterLink], templateUrl:'./pago.html', styleUrl:'../../styles/cuenta.css'})
export class Pago {
  /** Estado compartido del carrito temporal de la aplicación. */
  readonly carrito=inject(CarritoDemo);
  /** Inventario compartido con disponibilidad actualizada durante la navegación. */
  private readonly catalogo=inject(Catalogo);
  /** Servicio de cuentas y sesión local utilizado por esta vista. */
  readonly auth=inject(Auth);
  /** Confirmación obligatoria de que el usuario entiende que la compra es simulada. */
  acepto=new FormControl(false,{nonNullable:true, validators:Validators.requiredTrue});
  /** Grupo reactivo que contiene la aceptación del pago de demostración. */
  formulario = new FormGroup({acepto:this.acepto});
  /** Mensaje de la última operación fallida; vacío cuando no hay error visible. */
  error='';
  /** Recibo temporal de una compra exitosa: folio, total en pesos y cantidad de unidades. */
  comprobante?: {folio:string; total:number; unidades:number};
  /**
   * Formatea un importe en pesos chilenos usando la configuración es-CL.
   * @param n Importe que se mostrará.
   * @returns Importe con prefijo de peso y separadores locales.
   */
  precio(n:number):string { return '$'+n.toLocaleString('es-CL'); }
  /** Valida sesión, carrito y aceptación; descuenta stock, crea un comprobante y vacía el carrito. Una compra ya confirmada no se procesa otra vez; los errores se muestran en la vista. */
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
