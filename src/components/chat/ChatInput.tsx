import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { Send, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

/**
 * ChatInput Component
 * Auto-expanding textarea with send functionality
 * - Enter: Send message
 * - Shift+Enter: New line
 */
export function ChatInput({ onSendMessage, isLoading, placeholder = 'Escribe tu pregunta...' }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <div
          className={cn(
            'flex items-end gap-2 bg-secondary rounded-2xl px-4 py-3 transition-all duration-200',
            'border border-border focus-within:border-primary/50 input-glow'
          )}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className={cn(
              'flex-1 bg-transparent resize-none outline-none text-sm text-foreground',
              'placeholder:text-muted-foreground min-h-[24px] max-h-[200px]',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          />

          {/* Microphone button (visual only) */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground flex-shrink-0"
            disabled
            title="Función de voz próximamente"
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Send button */}
          <Button
            type="button"
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            size="icon"
            className={cn(
              'h-8 w-8 rounded-full flex-shrink-0 transition-all duration-200',
              message.trim() && !isLoading
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 glow-effect'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Helper text */}
        <p className="text-[11px] text-muted-foreground text-center mt-2">
          Enter para enviar • Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
}
