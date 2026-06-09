# Redis Design - e-edito

## Overview

Redis serves as the real-time infrastructure layer for e-edito.

Unlike MongoDB, Redis is not used for permanent data storage. Redis is responsible for managing temporary state, real-time communication, distributed event propagation, presence tracking, and system performance optimization.

Redis enables:

* Real-time user presence
* Socket.IO horizontal scaling
* Active room tracking
* User connection management
* Rate limiting
* Temporary room state
* Pub/Sub communication

MongoDB remains the source of truth for persistent application data.

---

# Redis Responsibilities

## Real-Time Presence

Track users currently connected to rooms.

Examples:

* Active room participants
* Online users
* User connection state

---

## Socket.IO Scaling

Redis Pub/Sub allows multiple Socket.IO server instances to communicate.

Example:

```txt
Server A
    │
    ▼
 Redis Pub/Sub
    ▲
    │
Server B
```

This ensures all users receive events regardless of which server instance they are connected to.

---

## Connection Management

Redis stores temporary mappings between:

```txt
User
↔
Socket Connection
```

This enables:

* User lookup
* Presence updates
* Direct messaging
* Reconnection handling

---

## Rate Limiting

Redis prevents abuse of:

* Chat messages
* Room creation
* Invitations
* Code execution

---

## Temporary State Storage

Stores rapidly changing information that should not be persisted to MongoDB.

Examples:

* Active participants
* Current room presence
* Typing indicators
* Temporary WebRTC signaling data

---

# Redis Architecture

```txt
Next.js Client
        │
        ▼
Socket.IO Server
        │
        ▼
Redis Adapter
        │
        ▼
Redis Pub/Sub
        │
        ▼
Other Socket.IO Servers
```

---

# Redis Key Structure

## Room Users

Tracks users currently connected to a room.

### Key

```txt
room:{roomId}:users
```

### Type

```txt
SET
```

### Example

```txt
room:abc123:users
```

### Values

```txt
user_123
user_456
user_789
```

### Commands

Add user:

```redis
SADD room:abc123:users user_123
```

Remove user:

```redis
SREM room:abc123:users user_123
```

Get active users:

```redis
SMEMBERS room:abc123:users
```

---

# User Socket Mapping

Maps a user to their current Socket.IO connection.

### Key

```txt
user:{userId}:socket
```

### Type

```txt
STRING
```

### Example

```txt
user:user_123:socket
```

### Value

```txt
sJk2a92Kds
```

### Commands

Store:

```redis
SET user:user_123:socket sJk2a92Kds
```

Retrieve:

```redis
GET user:user_123:socket
```

Delete:

```redis
DEL user:user_123:socket
```

---

# Room Presence

Tracks current room occupancy.

### Key

```txt
room:{roomId}:presence
```

### Type

```txt
STRING
```

### Example

```txt
room:abc123:presence
```

### Value

```txt
25
```

### Commands

Increment:

```redis
INCR room:abc123:presence
```

Decrement:

```redis
DECR room:abc123:presence
```

---

# Typing Indicators

Tracks users currently typing.

### Key

```txt
room:{roomId}:typing
```

### Type

```txt
SET
```

### Example

```txt
room:abc123:typing
```

### Values

```txt
user_123
user_456
```

### Commands

Start typing:

```redis
SADD room:abc123:typing user_123
```

Stop typing:

```redis
SREM room:abc123:typing user_123
```

---

# WebRTC Signaling Cache

Temporary storage of WebRTC offers and answers.

### Key

```txt
room:{roomId}:webrtc
```

### Type

```txt
HASH
```

### Example

```txt
room:abc123:webrtc
```

### Value

```json
{
  "offer:user1": "...",
  "answer:user2": "..."
}
```

### Expiration

```txt
5 Minutes
```

After negotiation completes the data can be removed.

---

# Rate Limiting

Prevents abuse of system resources.

### Key

```txt
rate:{userId}
```

### Type

```txt
STRING
```

### Example

```txt
rate:user_123
```

### Commands

```redis
INCR rate:user_123
EXPIRE rate:user_123 60
```

### Usage

Protect:

* Room creation
* Message sending
* Invitations
* Code execution

---

# Pub/Sub Channels

Redis Pub/Sub is used for distributed event communication.

---

## Room Events

### Channel

```txt
room:{roomId}
```

### Example

```txt
room:abc123
```

### Events

```txt
USER_JOINED

USER_LEFT

MESSAGE_SENT

VERSION_CREATED
```

---

## Code Synchronization

### Channel

```txt
room:{roomId}:code
```

### Example

```txt
room:abc123:code
```

### Events

```txt
CRDT_UPDATE
```

---

## Presence Events

### Channel

```txt
room:{roomId}:presence
```

### Events

```txt
USER_ONLINE

USER_OFFLINE
```

---

# Redis and Yjs

## Responsibility Separation

### Redis Handles

```txt
Presence

Pub/Sub

Socket.IO Adapter

Rate Limiting

Temporary State
```

### Yjs Handles

```txt
Document Synchronization

Conflict Resolution

Shared Document State

Cursor Awareness

Selection Awareness

User Awareness
```

### MongoDB Handles

```txt
Users

Rooms

Participants

Messages

Versions

Activity Logs
```

---

# Data Lifecycle

## User Joins Room

```txt
User Joins
        │
        ▼
Socket Connected
        │
        ▼
Add User To Redis
        │
        ▼
Broadcast Presence
```

---

## User Sends Message

```txt
Message
        │
        ▼
Socket.IO
        │
        ├── Save MongoDB
        │
        └── Broadcast Redis
```

---

## User Edits Code

```txt
Monaco
    │
    ▼
Yjs
    │
    ▼
Socket.IO
    │
    ▼
Redis Adapter
    │
    ▼
Other Users
```

MongoDB is not updated for every keystroke.

---

# TTL Strategy

The following keys should expire automatically.

| Key Pattern   | TTL           |
| ------------- | ------------- |
| rate:*        | 60 seconds    |
| room:*:webrtc | 5 minutes     |
| user:*:socket | On disconnect |
| room:*:typing | 30 seconds    |

---

# Design Principles

* Redis is not a source of truth.
* MongoDB stores all persistent business data.
* Redis stores only temporary and rapidly changing state.
* Real-time collaboration data is synchronized through Yjs.
* Socket.IO horizontal scaling relies on Redis Pub/Sub.
* Redis failures should not result in permanent data loss.
* All Redis data should be reconstructable from application state.

---

# Future Enhancements

Potential future Redis usage:

* Distributed locks
* Job queues
* Session caching
* Room analytics
* Live room metrics
* Active editor statistics
* Real-time monitoring dashboards

These features can be added without changing the current Redis architecture.
