'use client';

import { ReactNode, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IDELayoutProps {
  topBar: ReactNode;
  sidebar?: ReactNode;
  editor: ReactNode;
  rightPanel?: ReactNode;
  bottomPanel?: ReactNode;
  onSidebarCollapse?: (collapsed: boolean) => void;
  onRightPanelCollapse?: (collapsed: boolean) => void;
  onBottomPanelCollapse?: (collapsed: boolean) => void;
  defaultSidebarWidth?: number;
  defaultRightPanelWidth?: number;
  defaultBottomPanelHeight?: number;
  minSidebarWidth?: number;
  maxSidebarWidth?: number;
  minRightPanelWidth?: number;
  maxRightPanelWidth?: number;
  minBottomPanelHeight?: number;
  maxBottomPanelHeight?: number;
}

export function IDELayout({
  topBar,
  sidebar,
  editor,
  rightPanel,
  bottomPanel,
  onSidebarCollapse,
  onRightPanelCollapse,
  onBottomPanelCollapse,
  defaultSidebarWidth = 280,
  defaultRightPanelWidth = 320,
  defaultBottomPanelHeight = 200,
  minSidebarWidth = 200,
  maxSidebarWidth = 600,
  minRightPanelWidth = 240,
  maxRightPanelWidth = 600,
  minBottomPanelHeight = 100,
  maxBottomPanelHeight = 500,
}: IDELayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(defaultSidebarWidth);
  const [rightPanelWidth, setRightPanelWidth] = useState(defaultRightPanelWidth);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(defaultBottomPanelHeight);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [bottomPanelCollapsed, setBottomPanelCollapsed] = useState(false);

  // Horizontal resize handler for sidebar
  const handleSidebarResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(minSidebarWidth, Math.min(maxSidebarWidth, startWidth + deltaX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [sidebarWidth, minSidebarWidth, maxSidebarWidth]);

  // Horizontal resize handler for right panel
  const handleRightPanelResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = rightPanelWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = startX - e.clientX; // Reversed because we're resizing from the right
      const newWidth = Math.max(minRightPanelWidth, Math.min(maxRightPanelWidth, startWidth + deltaX));
      setRightPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [rightPanelWidth, minRightPanelWidth, maxRightPanelWidth]);

  // Vertical resize handler for bottom panel
  const handleBottomPanelResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = bottomPanelHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startY - e.clientY; // Reversed because we're resizing upward
      const newHeight = Math.max(minBottomPanelHeight, Math.min(maxBottomPanelHeight, startHeight + deltaY));
      setBottomPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [bottomPanelHeight, minBottomPanelHeight, maxBottomPanelHeight]);

  return (
    <div className="fixed inset-0 flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="flex-shrink-0 border-b border-border/40">
        {topBar}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex min-h-0">
        {/* Left Sidebar */}
        {sidebar && (
          <>
            <div
              className="flex flex-col bg-background border-r border-border/40 overflow-hidden transition-all"
              style={{
                width: sidebarCollapsed ? 0 : sidebarWidth,
              }}
            >
              {sidebarCollapsed ? null : sidebar}
            </div>

            {/* Sidebar Resize Handle */}
            {!sidebarCollapsed && (
              <div
                onMouseDown={handleSidebarResize}
                className="w-1 bg-border/30 hover:bg-primary/50 cursor-col-resize transition-colors group active:bg-primary/80"
                title="Drag to resize sidebar"
              />
            )}
          </>
        )}

        {/* Editor Area with Bottom Panel */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Editor */}
          <div className="flex-1 overflow-hidden min-h-0">
            {editor}
          </div>

          {/* Bottom Panel Resize Handle */}
          {bottomPanel && !bottomPanelCollapsed && (
            <div
              onMouseDown={handleBottomPanelResize}
              className="h-1 bg-border/30 hover:bg-primary/50 cursor-row-resize transition-colors active:bg-primary/80"
              title="Drag to resize console"
            />
          )}

          {/* Bottom Panel */}
          {bottomPanel && (
            <div
              className={cn(
                'bg-background border-t border-border/40 overflow-hidden transition-all flex flex-col',
                bottomPanelCollapsed ? 'h-0' : ''
              )}
              style={{
                height: bottomPanelCollapsed ? 0 : bottomPanelHeight,
              }}
            >
              {!bottomPanelCollapsed && bottomPanel}
            </div>
          )}
        </div>

        {/* Right Panel */}
        {rightPanel && (
          <>
            {/* Right Panel Resize Handle */}
            {!rightPanelCollapsed && (
              <div
                onMouseDown={handleRightPanelResize}
                className="w-1 bg-border/30 hover:bg-primary/50 cursor-col-resize transition-colors active:bg-primary/80"
                title="Drag to resize right panel"
              />
            )}

            <div
              className="flex flex-col bg-background border-l border-border/40 overflow-hidden transition-all"
              style={{
                width: rightPanelCollapsed ? 0 : rightPanelWidth,
              }}
            >
              {rightPanelCollapsed ? null : rightPanel}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
