export interface Transaccion {
  idTransaccion: number;
  idTarjeta?: number;
  monto: number;
  tipo: string; // "DEPOSITO" | "COMPRA"
  fecha: Date;
}
