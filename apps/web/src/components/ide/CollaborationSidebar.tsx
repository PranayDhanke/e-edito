'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Users,
  MessageSquare,
  Activity,
  X,
  Plus,
  Video,
  Mic,
  Send,
  Phone,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  isAudioOn: boolean;
  isVideoOn: boolean;
  color?: string;
}

interface ChatMessage {
  id: string;
  author: string;
  message: string;
  timestamp: Date;
  authorId?: string;
}

interface CollaborationSidebarProps {
  participants?: Participant[];
  messages?: ChatMessage[];
  currentUserId?: string;
  onSendMessage?: (message: string) => void;
  onParticipantClick?: (id: string) => void;
  onToggleAudio?: () => void;
  onToggleVideo?: () => void;
  onClose?: () => void;
  isAudioOn?: boolean;
  isVideoOn?: boolean;
}

type TabType = 'participants' | 'chat' | 'activity';

export function CollaborationSidebar({
  participants = [],
  messages = [],
  currentUserId,
  onSendMessage,
  onParticipantClick,
  onToggleAudio,
  onToggleVideo,
  onClose,
  isAudioOn = false,
  isVideoOn = false,
}: CollaborationSidebarProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('participants');
  const [messageInput, setMessageInput] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage?.(messageInput);
      setMessageInput('');
    }
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode; count?: number }> = [
    { id: 'participants', label: 'Participants', icon: <Users className="h-4 w-4" />, count: participants.length },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="h-4 w-4" />, count: messages.length },
    { id: 'activity', label: 'Activity', icon: <Activity className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-panel-bg border-l border-border/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border/30 px-3 py-2 flex-shrink-0">
        <h3 className="text-xs font-semibold uppercase tracking-wider">Collaboration</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={onClose}
          title="Close collaboration panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Media Controls */}
      <div className="flex items-center gap-1.5 border-b border-border/30 px-3 py-2 flex-shrink-0">
        <Button
          variant={isAudioOn ? 'default' : 'outline'}
          size="sm"
          className="flex-1 h-7 text-xs gap-1.5"
          onClick={onToggleAudio}
        >
          <Mic className="h-3.5 w-3.5" />
          {isAudioOn ? 'Audio' : 'Muted'}
        </Button>
        <Button
          variant={isVideoOn ? 'default' : 'outline'}
          size="sm"
          className="flex-1 h-7 text-xs gap-1.5"
          onClick={onToggleVideo}
        >
          <Video className="h-3.5 w-3.5" />
          {isVideoOn ? 'Video' : 'Off'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border/30 px-1 flex-shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count !== undefined && (
              <span className="ml-1 inline-flex items-center justify-center h-4 w-4 text-xs bg-accent/20 text-accent rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Participants Tab */}
        {activeTab === 'participants' && (
          <div className="flex-1 overflow-y-auto">
            {participants.length === 0 ? (
              <div className="flex items-center justify-center h-full p-4">
                <div className="text-center">
                  <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No participants online</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 p-3">
                {participants.map((participant) => (
                  <button
                    key={participant.id}
                    onClick={() => onParticipantClick?.(participant.id)}
                    className="w-full flex items-center gap-2.5 rounded-lg border border-border/30 bg-background/30 hover:bg-background/50 p-2.5 transition-colors text-left group"
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-white text-sm',
                        participant.color || 'bg-accent'
                      )}
                    >
                      {participant.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {participant.name}
                        {participant.id === currentUserId && (
                          <span className="text-muted-foreground ml-1">(You)</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {participant.isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>

                    {/* Media Status */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {participant.isAudioOn && (
                        <Mic className="h-3 w-3 text-ide-success" />
                      )}
                      {participant.isVideoOn && (
                        <Video className="h-3 w-3 text-ide-success" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center">
                    <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No messages yet</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex gap-2 text-xs',
                        msg.authorId === currentUserId ? 'flex-row-reverse' : ''
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-xs px-2.5 py-1.5 rounded-lg',
                          msg.authorId === currentUserId
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-background/50 text-foreground'
                        )}
                      >
                        <p className="font-medium">{msg.author}</p>
                        <p className="break-words">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} className="h-0" />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-border/30 p-2.5 flex-shrink-0">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 h-7 px-2 text-xs bg-background/50 border border-border/50 rounded transition-colors hover:border-border focus:border-accent focus:outline-none"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  title="Send message (Enter)"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>• {participants.length} participant{participants.length !== 1 ? 's' : ''} in room</p>
              <p>• {messages.length} message{messages.length !== 1 ? 's' : ''} sent</p>
              <p className="mt-4 font-medium text-foreground">Recent Activity</p>
              <div className="space-y-1.5 mt-2">
                {participants.slice(0, 3).map((p) => (
                  <p key={p.id}>• {p.name} joined the session</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
