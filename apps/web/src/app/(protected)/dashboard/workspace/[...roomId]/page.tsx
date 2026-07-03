"use client";

import { useGetRoom } from "@/api/hooks/room/getRoomDetail";
import { useLeaveRoom } from "@/api/hooks/room/leaveRoom";
import { executionService } from "@/api/services/executionService";
import { versionService } from "@/api/services/versionService";
import { ConsolePanelPro } from "@/components/ide/ConsolePanelPro";
import { IDELayout } from "@/components/ide/IDELayout";
import { IDERightPanel } from "@/components/ide/IDERightPanel";
import { IDESidebar } from "@/components/ide/IDESidebar";
import { IDEToolbar } from "@/components/ide/IDEToolbar";
import MonacoEditor, { EditorController } from "@/components/rooms/Editor";
import Participant from "@/components/rooms/Participant";
import RoomCall from "@/components/rooms/RoomCall";
import { RoomMessages } from "@/components/rooms/RoomMessages";
import { RoomToolsPanel } from "@/components/rooms/RoomToolsPanel";
import RoomVersions from "@/components/rooms/RoomVersions";
import { useSocket } from "@/socket/socket-provider";
import { useAuth, useUser } from "@clerk/nextjs";
import { Member, SocketEvent } from "@repo/shared-types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type ConsoleLine = {
  id: string;
  type: "log" | "error" | "warning" | "info" | "success";
  message: string;
  timestamp: Date;
};

const timestampLabel = () =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

const mapExecutionType = (
  type: "stdout" | "stderr" | "system" | "success" | "error",
): ConsoleLine["type"] => {
  switch (type) {
    case "stderr":
    case "error":
      return "error";
    case "success":
      return "success";
    case "system":
      return "info";
    default:
      return "log";
  }
};

const RoomWorkspace = () => {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const param = useParams();
  const queryParams = useSearchParams();
  const socket = useSocket();

  const [participants, setParticipants] = useState<Member[]>([]);
  const [initialCode, setInitialCode] = useState<Uint8Array>();
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);
  const [toolsDefaultTab, setToolsDefaultTab] = useState<"invite" | "logs">(
    "invite",
  );
  const [isConnected, setIsConnected] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<ConsoleLine[]>([
    {
      id: crypto.randomUUID(),
      type: "info",
      message: "Ready. Save a version or run the current file.",
      timestamp: new Date(),
    },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const [loadingVersionId, setLoadingVersionId] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null,
  );
  const editorControllerRef = useRef<EditorController | null>(null);

  const room_code = param.roomId?.[0] as string;
  const role = queryParams.get("role") || "viewer";

  const { data, isLoading, error } = useGetRoom(room_code);
  const [isLeaving, setIsLeaving] = useState(false);
  const { mutateAsync } = useLeaveRoom();

  const appendConsole = useCallback((lines: ConsoleLine[]) => {
    setConsoleOutput((current) => [...current, ...lines]);
  }, []);

  const handleLeaveRoom = async () => {
    if (!room_code || !user?.id || isLeaving) {
      return;
    }

    setIsLeaving(true);

    try {
      await mutateAsync(room_code);
      socket?.emit(SocketEvent.LEAVE_ROOM);
      toast.success("You left the room");
      router.push("/dashboard");
    } catch (leaveError) {
      toast.error(
        leaveError instanceof Error
          ? leaveError.message
          : "Failed to leave room",
      );
    } finally {
      setIsLeaving(false);
    }
  };

  const handleInitialCode = (update: Uint8Array) => {
    setInitialCode(update);
  };

  useEffect(() => {
    if (!socket || !room_code) {
      return;
    }

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleSocketError = (payload: unknown) => {
      console.error("socket error", payload);
      appendConsole([
        {
          id: crypto.randomUUID(),
          type: "error",
          message: "Socket connection reported an error.",
          timestamp: new Date(),
        },
      ]);
    };
    const handleRoomJoin = (participant: Member[]) => {
      setParticipants(participant);
    };

    socket.on(SocketEvent.ERROR, handleSocketError);
    socket.on(SocketEvent.ROOM_JOINED, handleRoomJoin);
    socket.on(SocketEvent.INITIAL_CODE, handleInitialCode);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      socket.emit(SocketEvent.JOIN_ROOM, { room_code, role });
    } else {
      socket.once("connect", () => {
        setIsConnected(true);
        socket.emit(SocketEvent.JOIN_ROOM, { room_code, role });
      });
    }

    return () => {
      socket.off(SocketEvent.ERROR, handleSocketError);
      socket.off(SocketEvent.ROOM_JOINED, handleRoomJoin);
      socket.off(SocketEvent.INITIAL_CODE, handleInitialCode);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [appendConsole, role, room_code, socket]);

  const handleSaveVersion = async () => {
    if (!room_code || !data?.language) {
      return;
    }

    const code = editorControllerRef.current?.getCode()?.trim();

    if (!code) {
      toast.error("Nothing to save yet");
      return;
    }

    const token = await getToken();

    if (!token) {
      toast.error("Authentication token not available");
      return;
    }

    setIsSavingVersion(true);

    try {
      const payload = await versionService.createVersion(token, {
        room_code,
        code,
        language: data.language,
        name: `Snapshot ${timestampLabel()}`,
        reason: "Manual save from workspace toolbar",
      });

      setSelectedVersionId(payload.data._id);
      await queryClient.invalidateQueries({
        queryKey: ["room-versions", room_code],
      });

      toast.success("Version saved");
      appendConsole([
        {
          id: crypto.randomUUID(),
          type: "success",
          message: `Saved version "${payload.data.name}".`,
          timestamp: new Date(),
        },
      ]);
    } catch (saveError) {
      toast.error(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save version",
      );
    } finally {
      setIsSavingVersion(false);
    }
  };

  const handleLoadVersion = async (versionId: string) => {
    const token = await getToken();

    if (!token) {
      toast.error("Authentication token not available");
      return;
    }

    setLoadingVersionId(versionId);

    try {
      const payload = await versionService.restoreVersion(token, versionId);
      editorControllerRef.current?.replaceCode(payload.data.code);
      setSelectedVersionId(versionId);
      toast.success(`Loaded "${payload.data.name}"`);
      appendConsole([
        {
          id: crypto.randomUUID(),
          type: "info",
          message: `Loaded version "${payload.data.name}" into the editor.`,
          timestamp: new Date(),
        },
      ]);
    } catch (loadError) {
      toast.error(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load version",
      );
    } finally {
      setLoadingVersionId(null);
    }
  };

  const handleRunCode = async () => {
    if (!room_code || !data?.language) {
      return;
    }

    const code = editorControllerRef.current?.getCode() || "";

    if (!code.trim()) {
      toast.error("Editor is empty");
      return;
    }

    const token = await getToken();

    if (!token) {
      toast.error("Authentication token not available");
      return;
    }

    setIsRunning(true);
    setConsoleOutput([
      {
        id: crypto.randomUUID(),
        type: "info",
        message: `Running ${data.language} in Docker...`,
        timestamp: new Date(),
      },
    ]);

    try {
      const result = await executionService.runCode(token, {
        room_code,
        language: data.language,
        code,
      });

      setConsoleOutput(
        result.output.map((line, index) => ({
          id: `${result.jobId}-${index}`,
          type: mapExecutionType(line.type),
          message: line.message,
          timestamp: new Date(line.timestamp),
        })),
      );

      if (result.status === "completed") {
        toast.success("Execution finished");
      } else {
        toast.error("Execution finished with errors");
      }
    } catch (runError) {
      setConsoleOutput([
        {
          id: crypto.randomUUID(),
          type: "error",
          message:
            runError instanceof Error ? runError.message : "Failed to run code",
          timestamp: new Date(),
        },
      ]);
      toast.error(runError instanceof Error ? runError.message : "Run failed");
    } finally {
      setIsRunning(false);
    }
  };

  const connectionState = socket?.connected ?? isConnected;

  if (isLoading && !participants.length && !initialCode) {
    return (
      <div className="min-h-[70vh] rounded-[2rem] border border-border/60 bg-card/70 p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Loading room workspace...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-destructive/30 bg-destructive/5 p-8 text-sm text-destructive">
        Error loading room {error.message}
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-[70vh] rounded-[2rem] border border-border/60 bg-card/70 p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">Loading user...</p>
      </div>
    );
  }

  return (
    <>
      <RoomToolsPanel
        key={`${room_code}-${toolsDefaultTab}-${isToolsPanelOpen ? "open" : "closed"}`}
        open={isToolsPanelOpen}
        onClose={() => setIsToolsPanelOpen(false)}
        defaultTab={toolsDefaultTab}
        roomCode={room_code}
        userId={data?.owner_id || ""}
        audioStatus={!!data?.is_audio_enabled}
        videoStatus={!!data?.is_video_enabled}
        isOwner={data?.owner_id === user?.id}
      />

      <IDELayout
        topBar={
          <IDEToolbar
            roomCode={room_code}
            roomName={data?.name || "Unnamed Room"}
            language={data?.language || "Unknown"}
            isConnected={connectionState}
            participantCount={participants.length}
            onRun={handleRunCode}
            onSave={handleSaveVersion}
            onShare={() => {
              setToolsDefaultTab("invite");
              setIsToolsPanelOpen(true);
            }}
            onLeave={handleLeaveRoom}
            isOwner={data?.owner_id === user?.id}
            isRunning={isRunning}
            isSaving={isSavingVersion}
          />
        }
        sidebar={
          <IDESidebar
            language={data?.language}
            roomCode={room_code}
            versionHistory={
              <RoomVersions
                roomCode={room_code}
                onLoadVersion={handleLoadVersion}
                selectedVersionId={selectedVersionId}
                loadingVersionId={loadingVersionId}
              />
            }
          />
        }
        editor={
          !initialCode ? (
            <div className="flex items-center justify-center h-full bg-[#0b1220]">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 rounded-full border-2 border-slate-600 border-t-cyan-400 mx-auto mb-3" />
                <p className="text-sm text-slate-300">Loading editor...</p>
              </div>
            </div>
          ) : (
            <MonacoEditor
              initialCode={initialCode}
              onReady={(controller) => {
                editorControllerRef.current = controller;
              }}
            />
          )
        }
        rightPanel={
          <IDERightPanel
            participants={
              <Participant
                roomCode={room_code}
                currentUserId={user?.id}
                isOwner={data?.owner_id === user?.id}
                participants={participants}
              />
            }
            messages={
              <RoomMessages roomCode={room_code} currentUserId={user?.id} />
            }
            video={
              data?.is_audio_enabled || data?.is_video_enabled ? (
                <RoomCall
                  currentUserId={user?.id}
                  isAudioEnabled={data?.is_audio_enabled}
                  isVideoEnabled={data?.is_video_enabled}
                  participants={participants}
                />
              ) : null
            }
          />
        }
        bottomPanel={
          <ConsolePanelPro
            output={consoleOutput}
            isRunning={isRunning}
            onClear={() => setConsoleOutput([])}
          />
        }
        defaultSidebarWidth={300}
        defaultRightPanelWidth={320}
        defaultBottomPanelHeight={220}
      />
    </>
  );
};

export default RoomWorkspace;
