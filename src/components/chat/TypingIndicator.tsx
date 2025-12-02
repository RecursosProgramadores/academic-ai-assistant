import { Bot } from 'lucide-react';

/**
 * TypingIndicator Component
 * Shows animated dots when AI is "thinking"
 */
export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
        <Bot className="w-4 h-4 text-secondary-foreground" />
      </div>

      {/* Typing animation */}
      <div className="message-bubble message-bubble-ai">
        <div className="typing-indicator py-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
