import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { TEXTO_REQUERIDO, validarEdad } from '../../validators/cuenta';
/** Edición de la cuenta activa; el rol no forma parte del formulario. */
@Component({selector:'app-perfil', imports:[ReactiveFormsModule], templateUrl:'./perfil.html', styleUrl:'../../styles/cuenta.css'})
export class Perfil {
  readonly auth = inject(Auth);
  formulario = new FormGroup({fullName:new FormControl('', {nonNullable:true, validators:TEXTO_REQUERIDO}), username:new FormControl('', {nonNullable:true, validators:TEXTO_REQUERIDO}), email:new FormControl('', {nonNullable:true, validators:[Validators.required, Validators.email]}), birthDate:new FormControl('', {nonNullable:true, validators:[Validators.required, validarEdad]}), address:new FormControl('', {nonNullable:true})});
  error=''; exito=false;
  constructor() { this.restaurar(); }
  restaurar(): void { const u=this.auth.usuario(); if(u) this.formulario.reset({fullName:u.fullName, username:u.username, email:u.email, birthDate:u.birthDate, address:u.address}); this.error=''; this.exito=false; }
  guardar(): void {
    this.error=''; this.exito=false; this.formulario.markAllAsTouched();
    if(this.formulario.invalid) { this.error='Completa nombre, usuario, correo válido y fecha de nacimiento (mínimo 13 años).'; return; }
    try { this.auth.actualizar(this.formulario.getRawValue()); this.exito=true; }
    catch(e) { this.error=e instanceof Error ? e.message : 'No se pudo guardar el perfil.'; }
  }
}
