import { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Settings,
  Upload,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/types/chat';
import { cn } from '@/lib/utils';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

/**
 * Sidebar Component
 * Fixed left navigation with chat history and actions
 */
export function Sidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onOpenUpload,
  onOpenSettings,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-72'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-sidebar-foreground text-sm">
                  AI Académico
                </h1>
                <p className="text-[10px] text-muted-foreground">Asistente del curso</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-muted-foreground hover:text-sidebar-foreground"
          >
            {isCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          className={cn(
            'w-full justify-start gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20',
            isCollapsed && 'justify-center px-0'
          )}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span>Nuevo Chat</span>}
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3">
        {!isCollapsed && (
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2 px-3">
            Historial
          </p>
        )}
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onMouseEnter={() => setHoveredId(conversation.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={cn(
                'sidebar-item group cursor-pointer',
                activeConversationId === conversation.id && 'sidebar-item-active'
              )}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate text-sm">
                    {conversation.title}
                  </span>
                  {hoveredId === conversation.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/20 rounded"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  )}
                </>
              )}
            </div>
          ))}

          {conversations.length === 0 && !isCollapsed && (
            <p className="text-xs text-muted-foreground text-center py-8 px-4">
              No hay conversaciones. Inicia un nuevo chat para comenzar.
            </p>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button
          onClick={onOpenUpload}
          className={cn(
            'sidebar-item w-full',
            isCollapsed && 'justify-center'
          )}
        >
          <Upload className="h-4 w-4" />
          {!isCollapsed && <span>Subir Documentos</span>}
        </button>
        <button
          onClick={onOpenSettings}
          className={cn(
            'sidebar-item w-full',
            isCollapsed && 'justify-center'
          )}
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span>Configuración</span>}
        </button>
      </div>
    </aside>
  );
}
