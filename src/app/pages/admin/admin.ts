import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Catalogo } from '../../services/catalogo';
/** Privilegio exclusivo del administrador: actualizar disponibilidad del catálogo. */
@Component({selector:'app-admin', imports:[ReactiveFormsModule], templateUrl:'./admin.html', styleUrl:'../../styles/cuenta.css'})
export class Admin {
  readonly catalogo=inject(Catalogo);
  readonly formularios = new Map(this.catalogo.juegos().map(j => [j.id, new FormGroup({stock:new FormControl(j.stock, {nonNullable:true, validators:[Validators.required, Validators.min(0), Validators.max(9999), Validators.pattern(/^\d+$/)]})})]));
  mensaje=''; error='';
  guardar(id:string):void {
    this.error=''; this.mensaje=''; const f=this.formularios.get(id)!; f.markAllAsTouched();
    if(f.invalid) { this.error='El stock debe ser un entero entre 0 y 9999.'; return; }
    try { this.catalogo.actualizarStock(id, f.controls.stock.value); this.mensaje='Stock actualizado en el catálogo.'; }
    catch(e) { this.error=e instanceof Error ? e.message : 'No se pudo actualizar.'; }
  }
}
