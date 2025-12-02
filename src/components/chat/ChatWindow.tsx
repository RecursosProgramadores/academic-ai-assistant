import { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { Message } from '@/types/chat';
import { GraduationCap, Sparkles } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

/**
 * ChatWindow Component
 * Main chat area with messages, typing indicator, and input
 */
export function ChatWindow({ messages, isLoading, onSendMessage }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          // Empty state
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 glow-effect">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Asistente Académico IA
            </h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              Pregunta sobre cualquier tema del curso. Puedo explicar conceptos,
              resolver ejercicios paso a paso y ayudarte con tus dudas.
            </p>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {[
                '¿Cómo puedo resolver este ejercicio?',
                'Explica el concepto de...',
                '¿Cuál es la diferencia entre...?',
                'Dame un ejemplo de...',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onSendMessage(suggestion)}
                  className="px-4 py-2 rounded-full bg-secondary text-sm text-foreground hover:bg-secondary/80 transition-colors flex items-center gap-2 group"
                >
                  <Sparkles className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Messages list
          <div className="p-4 space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
}
