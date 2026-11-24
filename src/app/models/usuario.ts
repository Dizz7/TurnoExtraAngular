/** Cuenta pública de la demostración; nunca expone el resumen de contraseña. */
export interface Usuario {
  id: string;
  fullName: string;
  username: string;
  email: string;
  birthDate: string;
  address: string;
  rol: 'cliente' | 'administrador';
}
export type DatosRegistro = Omit<Usuario, 'id' | 'rol'> & { password: string };
