export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  status: 'uploading' | 'processing' | 'ready' | 'error';
}

export type ChatStatus = 'idle' | 'loading' | 'error';
