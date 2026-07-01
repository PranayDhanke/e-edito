import { SocketEvent } from "@repo/shared-types";
import { Server, Socket } from "socket.io";

type WebRtcSignalPayload = {
  candidate?: unknown;
  sdp?: unknown;
  targetUserId: string;
};

const emitToTargetUser = async (
  io: Server,
  roomCode: string,
  targetUserId: string,
  event: string,
  payload: Record<string, unknown>,
) => {
  const sockets = await io.in(roomCode).fetchSockets();

  for (const targetSocket of sockets) {
    if (targetSocket.data.userId !== targetUserId) {
      continue;
    }

    targetSocket.emit(event, payload);
  }
};

const relaySignal = async (
  io: Server,
  socket: Socket,
  event: string,
  payload: WebRtcSignalPayload,
) => {
  const roomCode = socket.data.roomCode;
  const sourceUserId = socket.data.userId;

  if (!roomCode || !sourceUserId || !payload?.targetUserId) {
    return;
  }

  await emitToTargetUser(io, roomCode, payload.targetUserId, event, {
    candidate: payload.candidate,
    sdp: payload.sdp,
    sourceUserId,
  });
};

export const handleWebRtcOffer = async (
  io: Server,
  socket: Socket,
  payload: WebRtcSignalPayload,
) => {
  await relaySignal(io, socket, SocketEvent.WEBRTC_OFFER, payload);
};

export const handleWebRtcAnswer = async (
  io: Server,
  socket: Socket,
  payload: WebRtcSignalPayload,
) => {
  await relaySignal(io, socket, SocketEvent.WEBRTC_ANSWER, payload);
};

export const handleWebRtcIceCandidate = async (
  io: Server,
  socket: Socket,
  payload: WebRtcSignalPayload,
) => {
  await relaySignal(io, socket, SocketEvent.WEBRTC_ICE_CANDIDATE, payload);
};
