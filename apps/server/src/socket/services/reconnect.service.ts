const pendingDisconnects = new Map<string, NodeJS.Timeout>();

const getReconnectKey = (roomCode: string, userId: string) =>
  `${roomCode}:${userId}`;

const setPendingDisconnect = (
  roomCode: string,
  userId: string,
  timeout: NodeJS.Timeout,
) => {
  clearPendingDisconnect(roomCode, userId);
  pendingDisconnects.set(getReconnectKey(roomCode, userId), timeout);
};

const clearPendingDisconnect = (roomCode: string, userId: string) => {
  const key = getReconnectKey(roomCode, userId);
  const timeout = pendingDisconnects.get(key);

  if (!timeout) {
    return;
  }

  clearTimeout(timeout);
  pendingDisconnects.delete(key);
};

const removePendingDisconnect = (roomCode: string, userId: string) => {
  pendingDisconnects.delete(getReconnectKey(roomCode, userId));
};

export const reconnectService = {
  setPendingDisconnect,
  clearPendingDisconnect,
  removePendingDisconnect,
};
