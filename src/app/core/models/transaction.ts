import { Category } from "./category";

export interface Transaction {
  id?: number;
  category_id: number;
  name: string;
  description: string;
  amount: number;
  date: Date;
  type?: string;
  category?: Category;
  time: string;
}
