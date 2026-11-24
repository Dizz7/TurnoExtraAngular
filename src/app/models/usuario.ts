/** Datos públicos de una cuenta local; no incluyen sal ni resumen de contraseña. */
export interface Usuario {
  /** Identificador UUID de la cuenta. */
  id: string;
  /** Nombre completo mostrado en el perfil. */
  fullName: string;
  /** Nombre de usuario único, comparado sin distinguir mayúsculas. */
  username: string;
  /** Correo normalizado a minúsculas y sin espacios externos. */
  email: string;
  /** Fecha de nacimiento en formato YYYY-MM-DD. */
  birthDate: string;
  /** Dirección opcional; se representa con una cadena vacía si no se proporciona. */
  address: string;
  /** Privilegio de la cuenta; el registro público siempre asigna cliente. */
  rol: 'cliente' | 'administrador';
}
/** Datos necesarios para crear una cuenta; omite identificador y rol e incluye contraseña sin derivar. */
export type DatosRegistro = Omit<Usuario, 'id' | 'rol'> & { password: string };
