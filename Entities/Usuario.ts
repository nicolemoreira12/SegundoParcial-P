export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  direccion?: string;
  telefono?: string;
  rol?: string;
  fechaRegistro: Date;
}
