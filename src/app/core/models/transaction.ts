export interface Transaction {
  id?: number;
  category_id: number;
  name: string;
  description: string;
  amount: number;
  date: string;
  type?: string;
}
