export interface Amortization {
  id?: number;
  number_months: number;
  date: string;
  quota: number;
  interest: number;
  amortized: number;
  outstanding: number;
  status: string;
}

// Primero crea la interfaz del DTO (en tu archivo de interfaces)
export interface UpdateStatusDto {
  ids: number[];
  status: 'Pagado' | 'Pendiente'; // Ajusta los valores según tus necesidades
}