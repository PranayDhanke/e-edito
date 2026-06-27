import { SocketEvent } from "@repo/shared-types";
import { Socket } from "socket.io";
import * as Y from "yjs";

//creating a map to store a code from the yjs
const yjsCodeDoc = new Map<string, Y.Doc>();

//cleating a saving to to remember that we have to save code for this code on the remote update
const toSavedBeRoom = new Set<string>();

const getOrCreateCodeDoc = (roomCode: string) => {
  //get the doc if exists
  let doc = yjsCodeDoc.get(roomCode);

  //if not create
  if (!doc) {
    doc = new Y.Doc();
    yjsCodeDoc.set(roomCode, doc);
  }

  //retrun doc
  return doc;
};

const getCode = (roomCode: string) => {
  const doc = getOrCreateCodeDoc(roomCode);

  return doc.getText("editor").toString();
};

const createUpdate = (roomCode: string) => {
  const doc = getOrCreateCodeDoc(roomCode);
  return Y.encodeStateAsUpdate(doc);
};

const codeChangeService = (
  socket: Socket,
  code: Uint8Array,
  roomCode: string,
) => {
  const doc = getOrCreateCodeDoc(roomCode);

  Y.applyUpdate(doc, code);

  //adding the room code to the saving room
  toSavedBeRoom.add(roomCode);

  socket.to(roomCode).emit(SocketEvent.REMOTE_CODE_CHANGE, code);
};

const deleteDoc = (roomCode: string) => {
  yjsCodeDoc.delete(roomCode);
};

//fucntions for the saving room
const getSavingRooms = () => toSavedBeRoom;

const delSavingRoom = (roomCode: string) => {
  toSavedBeRoom.delete(roomCode);
};

export const codeService = {
  getOrCreateCodeDoc,
  createUpdate,
  getCode,
  codeChangeService,
  deleteDoc,
  getSavingRooms,
  delSavingRoom,
};
