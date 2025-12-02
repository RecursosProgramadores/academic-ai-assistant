/**
 * API Service for communication with FastAPI backend
 * 
 * This service handles all HTTP requests to the backend.
 * Configure BASE_URL to point to your FastAPI server.
 */

// Configure this URL to point to your FastAPI backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  context?: string[];
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  document_id?: string;
  filename?: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Send a chat message to the backend
 * POST /chat
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Error sending message: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Upload a document for RAG context
 * POST /upload-doc
 */
export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/upload-doc`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error uploading document: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Start a new conversation
 * POST /new-chat
 */
export async function createNewChat(): Promise<{ conversation_id: string }> {
  const response = await fetch(`${BASE_URL}/new-chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error creating new chat: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get conversation history (optional endpoint)
 * GET /conversations
 */
export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(`${BASE_URL}/conversations`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching conversations: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a conversation (optional endpoint)
 * DELETE /conversations/:id
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/conversations/${conversationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Error deleting conversation: ${response.statusText}`);
  }
}
