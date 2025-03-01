export interface Message {
    id: number;
    text: string;
    time: string;
    type: 'user' | 'bot' | 'loading' | 'bot-card';
    timestamp: number;
    imageUrl?: string;
    transaction?: any;
  }