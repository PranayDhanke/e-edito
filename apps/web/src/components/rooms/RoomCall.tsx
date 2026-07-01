"use client";

import { Member, SocketEvent } from "@repo/shared-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "@/socket/socket-provider";
import { toast } from "sonner";

type SignalPayload = {
  candidate?: RTCIceCandidateInit;
  sdp?: RTCSessionDescriptionInit;
  sourceUserId: string;
};

type RemoteStream = {
  stream: MediaStream;
  userId: string;
};

const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];

const MediaTile = ({
  label,
  muted,
  stream,
}: {
  label: string;
  muted?: boolean;
  stream: MediaStream | null;
}) => {
  const mediaRef = useRef<HTMLVideoElement>(null);
  const hasVideo = !!stream?.getVideoTracks().length;

  useEffect(() => {
    if (!mediaRef.current) {
      return;
    }

    mediaRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-background/80">
      <div className="aspect-video bg-slate-950/90">
        <video
          ref={mediaRef}
          autoPlay
          playsInline
          muted={muted}
          className={`h-full w-full object-cover ${hasVideo ? "" : "hidden"}`}
        />
        {!hasVideo && (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-200">
            Audio connected
          </div>
        )}
      </div>
      <div className="border-t border-border/60 px-4 py-3 text-sm font-medium text-foreground">
        {label}
      </div>
    </div>
  );
};

const RoomCall = ({
  currentUserId,
  isAudioEnabled,
  isVideoEnabled,
  participants,
}: {
  currentUserId?: string;
  isAudioEnabled?: boolean;
  isVideoEnabled?: boolean;
  participants: Member[];
}) => {
  const socket = useSocket();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [roomParticipants, setRoomParticipants] = useState<Member[]>(participants);
  const localStreamPromiseRef = useRef<Promise<MediaStream | null> | null>(null);
  const peerConnectionsRef = useRef(new Map<string, RTCPeerConnection>());
  const remoteStreamRef = useRef(new Map<string, MediaStream>());
  const pendingCandidatesRef = useRef(new Map<string, RTCIceCandidateInit[]>());
  const initiatedPeersRef = useRef(new Set<string>());

  const mediaEnabled = !!(isAudioEnabled || isVideoEnabled);

  useEffect(() => {
    setRoomParticipants(participants);
  }, [participants]);

  const getParticipantName = useCallback(
    (userId: string) =>
      roomParticipants.find((participant) => participant._id === userId)?.name ||
      "Participant",
    [roomParticipants],
  );

  const removePeerConnection = useCallback((userId: string) => {
    const peerConnection = peerConnectionsRef.current.get(userId);

    if (peerConnection) {
      peerConnection.onicecandidate = null;
      peerConnection.ontrack = null;
      peerConnection.onconnectionstatechange = null;
      peerConnection.close();
      peerConnectionsRef.current.delete(userId);
    }

    remoteStreamRef.current.delete(userId);
    pendingCandidatesRef.current.delete(userId);
    initiatedPeersRef.current.delete(userId);
    setRemoteStreams((prev) => prev.filter((stream) => stream.userId !== userId));
  }, []);

  const addRemoteTrack = useCallback((userId: string, track: MediaStreamTrack) => {
    let remoteStream = remoteStreamRef.current.get(userId);

    if (!remoteStream) {
      remoteStream = new MediaStream();
      remoteStreamRef.current.set(userId, remoteStream);
    }

    if (!remoteStream.getTracks().some((existingTrack) => existingTrack.id === track.id)) {
      remoteStream.addTrack(track);
    }

    setRemoteStreams((prev) => {
      const existing = prev.find((stream) => stream.userId === userId);

      if (existing) {
        return prev.map((stream) =>
          stream.userId === userId
            ? { ...stream, stream: remoteStream! }
            : stream,
        );
      }

      return [...prev, { userId, stream: remoteStream }];
    });
  }, []);

  const getLocalStream = useCallback(async () => {
    if (!mediaEnabled || !navigator.mediaDevices?.getUserMedia) {
      return null;
    }

    if (localStream) {
      return localStream;
    }

    if (!localStreamPromiseRef.current) {
      localStreamPromiseRef.current = navigator.mediaDevices
        .getUserMedia({
          audio: !!isAudioEnabled,
          video: !!isVideoEnabled,
        })
        .then((stream) => {
          setLocalStream(stream);
          return stream;
        })
        .catch((error) => {
          toast.error("Unable to access microphone or camera");
          console.error(error);
          return null;
        })
        .finally(() => {
          localStreamPromiseRef.current = null;
        });
    }

    return localStreamPromiseRef.current;
  }, [isAudioEnabled, isVideoEnabled, localStream, mediaEnabled]);

  const flushPendingCandidates = useCallback(async (userId: string) => {
    const peerConnection = peerConnectionsRef.current.get(userId);
    const pendingCandidates = pendingCandidatesRef.current.get(userId);

    if (!peerConnection || !peerConnection.remoteDescription || !pendingCandidates?.length) {
      return;
    }

    for (const candidate of pendingCandidates) {
      await peerConnection.addIceCandidate(candidate);
    }

    pendingCandidatesRef.current.delete(userId);
  }, []);

  const createPeerConnection = useCallback(
    async (peerUserId: string) => {
      if (!socket || !currentUserId || !mediaEnabled || peerUserId === currentUserId) {
        return null;
      }

      const existingConnection = peerConnectionsRef.current.get(peerUserId);

      if (existingConnection) {
        return existingConnection;
      }

      const stream = await getLocalStream();

      if (!stream) {
        return null;
      }

      const peerConnection = new RTCPeerConnection({ iceServers });

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      peerConnection.ontrack = (event) => {
        event.streams.forEach((remoteStream) => {
          remoteStream.getTracks().forEach((track) => addRemoteTrack(peerUserId, track));
        });
      };

      peerConnection.onicecandidate = (event) => {
        if (!event.candidate) {
          return;
        }

        socket.emit(SocketEvent.WEBRTC_ICE_CANDIDATE, {
          targetUserId: peerUserId,
          candidate: event.candidate.toJSON(),
        });
      };

      peerConnection.onconnectionstatechange = () => {
        if (
          peerConnection.connectionState === "failed" ||
          peerConnection.connectionState === "closed"
        ) {
          removePeerConnection(peerUserId);
        }
      };

      peerConnectionsRef.current.set(peerUserId, peerConnection);

      return peerConnection;
    },
    [addRemoteTrack, currentUserId, getLocalStream, mediaEnabled, removePeerConnection, socket],
  );

  const createOffer = useCallback(
    async (peerUserId: string) => {
      if (!socket) {
        return;
      }

      const peerConnection = await createPeerConnection(peerUserId);

      if (!peerConnection || peerConnection.signalingState !== "stable") {
        return;
      }

      initiatedPeersRef.current.add(peerUserId);

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket.emit(SocketEvent.WEBRTC_OFFER, {
        targetUserId: peerUserId,
        sdp: offer,
      });
    },
    [createPeerConnection, socket],
  );

  const handleUserJoined = useCallback(
    (participant: Member) => {
      if (participant._id !== currentUserId) {
        removePeerConnection(participant._id);
      }

      setRoomParticipants((prev) => {
        const filtered = prev.filter((member) => member._id !== participant._id);
        return [...filtered, participant];
      });
    },
    [currentUserId, removePeerConnection],
  );

  const handleUserLeft = useCallback(
    (userId: string) => {
      removePeerConnection(userId);
      setRoomParticipants((prev) => prev.filter((participant) => participant._id !== userId));
    },
    [removePeerConnection],
  );

  const handleOffer = useCallback(
    async ({ sdp, sourceUserId }: SignalPayload) => {
      if (!socket || !sdp) {
        return;
      }

      const peerConnection = await createPeerConnection(sourceUserId);

      if (!peerConnection) {
        return;
      }

      await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      await flushPendingCandidates(sourceUserId);

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit(SocketEvent.WEBRTC_ANSWER, {
        targetUserId: sourceUserId,
        sdp: answer,
      });
    },
    [createPeerConnection, flushPendingCandidates, socket],
  );

  const handleAnswer = useCallback(
    async ({ sdp, sourceUserId }: SignalPayload) => {
      if (!sdp) {
        return;
      }

      const peerConnection = peerConnectionsRef.current.get(sourceUserId);

      if (!peerConnection) {
        return;
      }

      await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      await flushPendingCandidates(sourceUserId);
    },
    [flushPendingCandidates],
  );

  const handleIceCandidate = useCallback(
    async ({ candidate, sourceUserId }: SignalPayload) => {
      if (!candidate) {
        return;
      }

      const peerConnection = peerConnectionsRef.current.get(sourceUserId);

      if (!peerConnection || !peerConnection.remoteDescription) {
        const pending = pendingCandidatesRef.current.get(sourceUserId) || [];
        pending.push(candidate);
        pendingCandidatesRef.current.set(sourceUserId, pending);
        return;
      }

      await peerConnection.addIceCandidate(candidate);
    },
    [],
  );

  useEffect(() => {
    if (!mediaEnabled) {
      return;
    }

    void getLocalStream();
  }, [getLocalStream, mediaEnabled]);

  useEffect(() => {
    if (!socket || !mediaEnabled) {
      return;
    }

    socket.on(SocketEvent.USER_JOINED, handleUserJoined);
    socket.on(SocketEvent.USER_LEFT_RES, handleUserLeft);
    socket.on(SocketEvent.WEBRTC_OFFER, handleOffer);
    socket.on(SocketEvent.WEBRTC_ANSWER, handleAnswer);
    socket.on(SocketEvent.WEBRTC_ICE_CANDIDATE, handleIceCandidate);

    return () => {
      socket.off(SocketEvent.USER_JOINED, handleUserJoined);
      socket.off(SocketEvent.USER_LEFT_RES, handleUserLeft);
      socket.off(SocketEvent.WEBRTC_OFFER, handleOffer);
      socket.off(SocketEvent.WEBRTC_ANSWER, handleAnswer);
      socket.off(SocketEvent.WEBRTC_ICE_CANDIDATE, handleIceCandidate);
    };
  }, [
    handleAnswer,
    handleIceCandidate,
    handleOffer,
    handleUserJoined,
    handleUserLeft,
    mediaEnabled,
    socket,
  ]);

  useEffect(() => {
    if (!currentUserId || !mediaEnabled || !localStream) {
      return;
    }

    roomParticipants.forEach((participant) => {
      if (participant._id === currentUserId) {
        return;
      }

      if (currentUserId.localeCompare(participant._id) <= 0) {
        return;
      }

      if (initiatedPeersRef.current.has(participant._id)) {
        return;
      }

      void createOffer(participant._id);
    });
  }, [createOffer, currentUserId, localStream, mediaEnabled, roomParticipants]);

  useEffect(() => {
    return () => {
      peerConnectionsRef.current.forEach((peerConnection) => {
        peerConnection.close();
      });
      peerConnectionsRef.current.clear();
      remoteStreamRef.current.clear();
      pendingCandidatesRef.current.clear();
      initiatedPeersRef.current.clear();

      setRemoteStreams([]);

      setLocalStream((currentStream) => {
        currentStream?.getTracks().forEach((track) => track.stop());
        return null;
      });
    };
  }, []);

  if (!mediaEnabled) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-border/60 bg-card/85 p-5 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.4)] backdrop-blur">
      <div className="mb-4">
        <h2 className="font-heading text-xl font-semibold">Room Call</h2>
        <p className="text-sm text-muted-foreground">
          Live audio and video for everyone in this room.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MediaTile label="You" muted stream={localStream} />
        {remoteStreams.map(({ stream, userId }) => (
          <MediaTile
            key={userId}
            label={getParticipantName(userId)}
            stream={stream}
          />
        ))}
      </div>
    </section>
  );
};

export default RoomCall;
