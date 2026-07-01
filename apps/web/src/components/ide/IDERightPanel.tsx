'use client';

import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Video, X } from 'lucide-react';
import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IDERightPanelProps {
  participants?: ReactNode;
  messages?: ReactNode;
  video?: ReactNode;
  onClose?: () => void;
  defaultTab?: 'participants' | 'messages' | 'video';
}

export function IDERightPanel({
  participants,
  messages,
  video,
  onClose,
  defaultTab = 'participants',
}: IDERightPanelProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = [
    { id: 'participants', label: 'Participants', icon: Users, content: participants },
    { id: 'messages', label: 'Messages', icon: MessageSquare, content: messages },
    { id: 'video', label: 'Video', icon: Video, content: video },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between gap-1 px-3 py-2 border-b border-border/30">
        <div className="flex items-center gap-1 flex-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              className="px-2"
            >
              <tab.icon className="size-3.5" />
              <span className="hidden sm:inline text-xs ml-1">{tab.label}</span>
            </Button>
          ))}
        </div>

        {onClose && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="px-2 h-8 w-8"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {activeTab === 'participants' && (
            <div className="p-3">
              {participants ? (
                participants
              ) : (
                <div className="flex items-center justify-center h-40 text-center">
                  <div>
                    <Users className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No participants</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="p-3">
              {messages ? (
                messages
              ) : (
                <div className="flex items-center justify-center h-40 text-center">
                  <div>
                    <MessageSquare className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No messages</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'video' && (
            <div className="p-3">
              {video ? (
                video
              ) : (
                <div className="flex items-center justify-center h-40 text-center">
                  <div>
                    <Video className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Video disabled</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
