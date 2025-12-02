import { useState, useCallback } from 'react';
import { Message, Conversation, ChatStatus } from '@/types/chat';
import { sendChatMessage, createNewChat } from '@/services/api';

/**
 * useChat Hook
 * Manages chat state and API communication
 */
export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Get current conversation
  const currentConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  // Create a new chat
  const startNewChat = useCallback(async () => {
    try {
      // For demo purposes, create local conversation
      // In production, call: const response = await createNewChat();
      const newConversation: Conversation = {
        id: crypto.randomUUID(),
        title: 'Nueva conversación',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setConversations((prev) => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);
      setError(null);

      return newConversation.id;
    } catch (err) {
      console.error('Error creating new chat:', err);
      setError('Error al crear nueva conversación');
      return null;
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Ensure we have an active conversation
      let conversationId = activeConversationId;
      if (!conversationId) {
        conversationId = await startNewChat();
        if (!conversationId) return;
      }

      // Create user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      // Add user message to conversation
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            // Update title with first message
            const title =
              c.messages.length === 0
                ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
                : c.title;
            return {
              ...c,
              title,
              messages: [...c.messages, userMessage],
              updatedAt: new Date(),
            };
          }
          return c;
        })
      );

      setStatus('loading');
      setError(null);

      try {
        // Send to backend
        const response = await sendChatMessage({
          message: content,
          conversation_id: conversationId,
        });

        // Create AI response message
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.response,
          timestamp: new Date(),
        };

        // Add AI message to conversation
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === conversationId) {
              return {
                ...c,
                messages: [...c.messages, aiMessage],
                updatedAt: new Date(),
              };
            }
            return c;
          })
        );

        setStatus('idle');
      } catch (err) {
        console.error('Error sending message:', err);
        setStatus('error');
        setError('Error al enviar mensaje. Verifica la conexión con el backend.');

        // Add error message as AI response for demo
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            '⚠️ No se pudo conectar con el backend. Asegúrate de que el servidor FastAPI esté ejecutándose en `http://localhost:8000`.\n\n**Para probar la interfaz**, el backend debe exponer estos endpoints:\n\n```\nPOST /chat\nPOST /upload-doc\nPOST /new-chat (opcional)\n```',
          timestamp: new Date(),
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === conversationId) {
              return {
                ...c,
                messages: [...c.messages, errorMessage],
                updatedAt: new Date(),
              };
            }
            return c;
          })
        );
      }
    },
    [activeConversationId, startNewChat]
  );

  // Delete a conversation
  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    },
    [activeConversationId]
  );

  // Select a conversation
  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setError(null);
  }, []);

  return {
    conversations,
    currentConversation,
    activeConversationId,
    status,
    error,
    sendMessage,
    startNewChat,
    deleteConversation,
    selectConversation,
  };
}
