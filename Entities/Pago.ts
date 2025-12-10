export interface Pago {
  idPago: number;
  monto: number;
  metodoPago: string;
  estadoPago: string;
  fechaPago: Date;
  hashTransaccion: string;
  idOrden: number;
}
