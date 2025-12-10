export interface TarjetaVirtual {
  idTarjeta: number;
  idUsuario: number;
  numeroTarjeta: string;
  saldoDisponible: number;
  fechaExpiracion: Date;
  estado: string;
}
