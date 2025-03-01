export interface Message {
    id: number;
    text: string;
    time: string;
    type: 'user' | 'bot';
    timestamp: number;
    imageUrl?: string;
  }