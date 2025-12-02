import { useState } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { MobileSidebar } from '@/components/sidebar/MobileSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { FileUploadModal } from '@/components/upload/FileUploadModal';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { useChat } from '@/hooks/useChat';
import { GraduationCap } from 'lucide-react';

/**
 * Main Index Page
 * Academic AI Assistant Dashboard Layout
 */
const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const {
    conversations,
    currentConversation,
    activeConversationId,
    status,
    sendMessage,
    startNewChat,
    deleteConversation,
    selectConversation,
  } = useChat();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewChat={startNewChat}
          onSelectConversation={selectConversation}
          onDeleteConversation={deleteConversation}
          onOpenUpload={() => setUploadModalOpen(true)}
          onOpenSettings={() => setSettingsModalOpen(true)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
          <MobileSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onNewChat={startNewChat}
            onSelectConversation={selectConversation}
            onDeleteConversation={deleteConversation}
            onOpenUpload={() => setUploadModalOpen(true)}
            onOpenSettings={() => setSettingsModalOpen(true)}
            isOpen={mobileSidebarOpen}
            onOpenChange={setMobileSidebarOpen}
          />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-sm">
              AI Académico
            </span>
          </div>
        </header>

        {/* Chat Window */}
        <div className="flex-1 min-h-0">
          <ChatWindow
            messages={currentConversation?.messages || []}
            isLoading={status === 'loading'}
            onSendMessage={sendMessage}
          />
        </div>
      </main>

      {/* Modals */}
      <FileUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
};

export default Index;
