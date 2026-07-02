'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Download,
  Trash2,
  RotateCcw,
  Search,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Version {
  id: string;
  name: string;
  description?: string;
  timestamp: Date;
  author?: string;
  linesChanged?: number;
  language?: string;
  preview?: string;
}

interface VersionHistoryPanelProps {
  versions?: Version[];
  isLoading?: boolean;
  error?: Error | null;
  onLoadVersion?: (id: string) => void;
  onDeleteVersion?: (id: string) => void;
  onDownloadVersion?: (id: string) => void;
  selectedVersionId?: string;
}

export function VersionHistoryPanel({
  versions = [],
  isLoading = false,
  error = null,
  onLoadVersion,
  onDeleteVersion,
  onDownloadVersion,
  selectedVersionId,
}: VersionHistoryPanelProps) {
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'newest' | 'oldest'>('newest');

  const filteredVersions = React.useMemo(() => {
    let filtered = versions.filter(
      (v) =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.description?.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === 'oldest') {
      filtered = filtered.reverse();
    }

    return filtered;
  }, [versions, search, sortBy]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-panel-bg">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent mx-auto mb-3" />
            <p className="text-xs text-muted-foreground">Loading versions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-panel-bg p-4">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-xs text-destructive font-medium mb-1">Error loading versions</p>
            <p className="text-xs text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-panel-bg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border/30 bg-panel-bg p-3 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">Version History</h3>
          <span className="ml-auto text-xs bg-accent/20 text-accent px-2 py-1 rounded">
            {filteredVersions.length}
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search versions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 text-xs bg-background/50 border border-border/50 rounded transition-colors hover:border-border focus:border-accent focus:outline-none"
          />
        </div>

        {/* Sort Controls */}
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant={sortBy === 'newest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('newest')}
            className="text-xs flex-1"
          >
            Newest
          </Button>
          <Button
            variant={sortBy === 'oldest' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('oldest')}
            className="text-xs flex-1"
          >
            Oldest
          </Button>
        </div>
      </div>

      {/* Version List */}
      <div className="flex-1 overflow-y-auto">
        {filteredVersions.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <Clock className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">
                {search ? 'No versions match your search' : 'No saved versions yet'}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Use Save button to create versions
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-3">
            {filteredVersions.map((version, idx) => (
              <div
                key={version.id}
                className={cn(
                  'group rounded-lg border transition-all cursor-pointer',
                  selectedVersionId === version.id
                    ? 'border-accent bg-accent/10'
                    : 'border-border/30 bg-background/30 hover:border-border/60 hover:bg-background/50'
                )}
                onClick={() => onLoadVersion?.(version.id)}
              >
                <div className="p-2.5">
                  {/* Version Name */}
                  <div className="flex items-start gap-2 mb-1.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {version.name || `Version ${idx + 1}`}
                      </p>
                      {version.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {version.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
                    <span>
                      {version.timestamp.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {version.author && (
                      <>
                        <span>•</span>
                        <span>{version.author}</span>
                      </>
                    )}
                    {version.linesChanged !== undefined && (
                      <>
                        <span>•</span>
                        <span>{version.linesChanged} lines</span>
                      </>
                    )}
                  </div>

                  {/* Code Preview */}
                  {version.preview && (
                    <div className="mb-2 rounded bg-editor-bg p-2 font-mono text-xs text-editor-fg/70 max-h-16 overflow-hidden line-clamp-3">
                      {version.preview}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1.5 text-xs gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoadVersion?.(version.id);
                      }}
                      title="Restore this version"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Restore
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1.5 text-xs gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadVersion?.(version.id);
                      }}
                      title="Download version"
                    >
                      <Download className="h-3 w-3" />
                      Export
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-1.5 text-xs gap-1 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteVersion?.(version.id);
                      }}
                      title="Delete version"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
