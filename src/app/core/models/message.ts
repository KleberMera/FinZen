import { Transaction } from "./transaction";

export interface Message {
    id: number;
    text: string;
    time: string;
    type: 'user' | 'bot' | 'loading' | 'bot-card' | 'bot-multiple-transactions';
    timestamp: number;
    imageUrl?: string;
    transaction?: Transaction;
    transactions?: Transaction[];
    receiptImageS3Key?: string;
  }