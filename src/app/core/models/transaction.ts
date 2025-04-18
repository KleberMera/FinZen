import { Category } from "./category";

export interface Transaction {
  id?: number;
  category_id: number;
  name: string;
  description: string;
  amount: number;
  date: string;
  type?: string;
  payment_method?: string
  category?: Category;
  time: string;
  createdAt?: string;
  
}


export interface TransactionName {
  id: number;
  name: string;
}


