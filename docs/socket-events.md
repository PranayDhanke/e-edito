# Socket Events Documentation - e-edito

## Overview

This document defines all Socket.IO events used by e-edito.

The system uses Socket.IO for:

* Room management
* Chat
* Presence
* WebRTC signaling
* Version synchronization
* Participant management

---

# Naming Convention

Event names follow:

```txt
feature:action
```

Examples:

```txt
room:join

chat:send

participant:remove

webrtc:offer
```

---

# Room Events

## room:join

### Direction

```txt
Client → Server
```

### Payload

```ts
{
  roomId: string
}
```

### Purpose

Join a collaboration room.

---

## room:joined

### Direction

```txt
Server → Client
```

### Payload

```ts
{
  roomId: string

  roomName: string

  participants: Participant[]
}
```

---

## room:leave

### Direction

```txt
Client → Server
```

### Payload

```ts
{
  roomId: string
}
```

---

## room:user-joined

### Direction

```txt
Server → Clients
```

### Payload

```ts
{
  userId: string

  userName: string
}
```

---

## room:user-left

### Direction

```txt
Server → Clients
```

### Payload

```ts
{
  userId: string
}
```

---

# Chat Events

## chat:send

### Direction

```txt
Client → Server
```

### Payload

```ts
{
  roomId: string

  message: string
}
```

---

## chat:received

### Direction

```txt
Server → Clients
```

### Payload

```ts
{
  id: string

  senderId: string

  senderName: string

  message: string

  createdAt: Date
}
```

---

# Presence Events

## presence:update

### Direction

```txt
Server → Clients
```

### Payload

```ts
{
  onlineUsers: number
}
```

---

## typing:start

### Direction

```txt
Client → Server
```

### Payload

```ts
{
  roomId: string
}
```

---

## typing:stop

### Direction

```txt
Client → Server
```

### Payload

```ts
{
  roomId: string
}
```

---

# Version Events

## version:create

### Direction

```txt
Client → Server
```

### Payload

```ts
{
  roomId: string

  name: string
}
```

---

## version:created

### Direction

```txt
Server → Client
```

### Payload

```ts
{
  versionId: string
}
```

---

## version:restore

### Direction

```txt
Client → Server
```

### Payload

```ts
{
  roomId: string

  versionId: string
}
```

---

# Participant Events

## participant:invite

### Direction

```txt
Client → Server
```

### Payload

```ts
{
  roomId: string

  userId: string
}
```

---

## participant:remove

### Direction

```txt
Client → Server
```

### Payload

```ts
{
  roomId: string

  userId: string
}
```

---

## participant:ban

### Direction

```txt
Client → Server
```

### Payload

```ts
{
  roomId: string

  userId: string
}
```

---

## participant:role-update

### Direction

```txt
Client → Server
```

### Payload

```ts
{
  roomId: string

  userId: string

  role: "EDITOR" | "VIEWER"
}
```

---

# WebRTC Signaling Events

## webrtc:offer

```ts
{
  roomId: string

  offer: RTCSessionDescription
}
```

---

## webrtc:answer

```ts
{
  roomId: string

  answer: RTCSessionDescription
}
```

---

## webrtc:ice-candidate

```ts
{
  roomId: string

  candidate: RTCIceCandidate
}
```

---

# Error Events

## error

### Direction

```txt
Server → Client
```

### Payload

```ts
{
  code: string

  message: string
}
```
