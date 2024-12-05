export interface Deudas {
  id: number;
  usuario_id: number;
  acreedor: string;
  monto_total: string;
  saldo_pendiente: string;
  tasa_interes: string;
  fecha_inicio: string;
  fecha_limite: string;
  estrategia_id: number;
  estado: string;
  tipo_deuda: string;
}
