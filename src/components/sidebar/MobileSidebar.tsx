import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { Conversation } from '@/types/chat';

interface MobileSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * MobileSidebar Component
 * Drawer-style sidebar for mobile devices
 */
export function MobileSidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onOpenUpload,
  onOpenSettings,
  isOpen,
  onOpenChange,
}: MobileSidebarProps) {
  const handleSelectConversation = (id: string) => {
    onSelectConversation(id);
    onOpenChange(false);
  };

  const handleNewChat = () => {
    onNewChat();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-10 w-10"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-sidebar border-sidebar-border">
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={onDeleteConversation}
          onOpenUpload={onOpenUpload}
          onOpenSettings={onOpenSettings}
          isCollapsed={false}
          onToggleCollapse={() => {}}
        />
      </SheetContent>
    </Sheet>
  );
}
