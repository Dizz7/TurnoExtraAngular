import { ALMACEN, SESION } from '../services/almacen';
/** Almacenamiento aislado: las pruebas nunca escriben cuentas del navegador. */
export class AlmacenPruebas implements Storage {
  private datos = new Map<string,string>();
  get length() { return this.datos.size; }
  clear():void { this.datos.clear(); }
  getItem(k:string):string|null { return this.datos.get(k) ?? null; }
  key(n:number):string|null { return Array.from(this.datos.keys())[n] ?? null; }
  removeItem(k:string):void { this.datos.delete(k); }
  setItem(k:string,v:string):void { this.datos.set(k,v); }
}
export const cuentasDePrueba = () => [{provide:ALMACEN, useValue:new AlmacenPruebas()}, {provide:SESION, useValue:new AlmacenPruebas()}];
