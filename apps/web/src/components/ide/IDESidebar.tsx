'use client';

import { Button } from '@/components/ui/button';
import { FileText, History, Code2, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface IDESidebarProps {
  versionHistory?: ReactNode;
  language?: string;
  roomCode?: string;
}

export function IDESidebar({ versionHistory, language = 'JavaScript', roomCode }: IDESidebarProps) {
  const [activeTab, setActiveTab] = useState<'files' | 'history'>('files');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    files: true,
    history: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Sidebar Tabs */}
      <div className="flex items-center gap-1 px-2 py-2 border-b border-border/30">
        <Button
          variant={activeTab === 'files' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('files')}
          className="flex-1 gap-1.5 justify-start"
        >
          <FileText className="size-3.5" />
          <span className="text-xs">Files</span>
        </Button>

        <Button
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('history')}
          className="flex-1 gap-1.5 justify-start"
        >
          <History className="size-3.5" />
          <span className="text-xs">History</span>
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'files' && (
          <div className="p-2 space-y-1">
            {/* Current File Section */}
            <div className="rounded-md border border-border/30 bg-background/60 overflow-hidden">
              <button
                onClick={() => toggleSection('currentFile')}
                className="w-full flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-background/80 transition-colors"
              >
                {expandedSections['currentFile'] ? (
                  <ChevronDown className="size-3.5" />
                ) : (
                  <ChevronRight className="size-3.5" />
                )}
                <Code2 className="size-3.5 text-primary" />
                <span>Current File</span>
              </button>

              {expandedSections['currentFile'] && (
                <div className="px-3 py-2 border-t border-border/20 bg-background/30 space-y-1">
                  <div className="text-xs text-muted-foreground flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span>Language:</span>
                      <span className="font-mono font-semibold">{language}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Room Code:</span>
                      <span className="font-mono font-semibold text-primary">{roomCode}</span>
                    </div>
                    <div className="pt-1 border-t border-border/20">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs h-7"
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-md border border-border/30 bg-background/60 p-3 mt-2">
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Lines:</span>
                  <span className="font-mono font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Characters:</span>
                  <span className="font-mono font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-mono font-semibold">0 B</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-2">
            {versionHistory ? (
              versionHistory
            ) : (
              <div className="flex items-center justify-center h-40 text-center">
                <div>
                  <History className="size-6 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No version history</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
