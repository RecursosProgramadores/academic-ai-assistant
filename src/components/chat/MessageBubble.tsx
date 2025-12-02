import { memo } from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

/**
 * MessageBubble Component
 * Renders individual chat messages with different styles for user and AI
 * Supports Markdown rendering for AI responses
 */
export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-primary' : 'bg-secondary'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-primary-foreground" />
        ) : (
          <Bot className="w-4 h-4 text-secondary-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'message-bubble',
          isUser ? 'message-bubble-user' : 'message-bubble-ai'
        )}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                // Custom code block styling
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  
                  return isInline ? (
                    <code
                      className="bg-background/50 px-1.5 py-0.5 rounded text-primary font-mono text-xs"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-background/50 rounded-lg p-4 overflow-x-auto my-3">
                      <code className="font-mono text-xs text-foreground" {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                // Custom paragraph styling
                p({ children }) {
                  return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>;
                },
                // Custom list styling
                ul({ children }) {
                  return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>;
                },
                // Custom heading styling
                h1({ children }) {
                  return <h1 className="text-lg font-semibold mb-2 text-foreground">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-base font-semibold mb-2 text-foreground">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-sm font-semibold mb-2 text-foreground">{children}</h3>;
                },
                // Custom blockquote styling
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground my-2">
                      {children}
                    </blockquote>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground mt-1 block opacity-70">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
});
