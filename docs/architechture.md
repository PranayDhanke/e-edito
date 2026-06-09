# e-edito Architecture

## Summary

e-edito is a real-time collaborative code editor that enables multiple users to write, edit, execute, and discuss code simultaneously.

The system combines CRDT-based synchronization, real-time communication, version management, chat, and audio/video collaboration into a unified platform.

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Monaco Editor
* Socket.IO Client
* Yjs

## Backend

* Node.js
* Express.js
* Socket.IO

## Database

* MongoDB

## Cache & Messaging

* Redis
* Socket.IO Redis Adapter

## Authentication

* Clerk

## Background Jobs

* BullMQ

## Real-Time Collaboration

* Yjs (CRDT)
* Awareness Protocol

---

# System Architecture

```mermaid
flowchart TB

    User[User]

    subgraph Frontend
        NextJS[Next.js App]
        Monaco[Monaco Editor]
        YjsClient[Yjs Client]
        SocketClient[Socket.IO Client]
        WebRTCClient[WebRTC Client]
    end

    subgraph Authentication
        Clerk[Clerk]
    end

    subgraph Backend
        Express[Express API]
        SocketServer[Socket.IO Server]
        SignalServer[WebRTC Signaling]
    end

    subgraph Realtime
        Redis[(Redis)]
        RedisAdapter[Socket.IO Redis Adapter]
        YjsServer[Yjs Document State]
    end

    subgraph Persistence
        Mongo[(MongoDB)]
        BullMQ[BullMQ]
    end

    User --> NextJS

    NextJS --> Clerk

    NextJS --> Monaco
    Monaco --> YjsClient

    YjsClient --> SocketClient

    SocketClient <--> SocketServer

    SocketServer --> RedisAdapter
    RedisAdapter --> Redis

    SocketServer --> YjsServer

    Express --> Mongo
    SocketServer --> Mongo

    BullMQ --> Mongo
    BullMQ --> Redis

    NextJS --> Express

    WebRTCClient --> SignalServer
    SignalServer --> SocketServer
```
---

# Monorepo Structure

```text
e-edito/

├── apps/
│   ├── web/
│   └── server/
│
├── packages/
│
├── docs/
│
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Responsibilities

### apps/web

Frontend application.

Responsible for:

* UI
* Authentication
* Monaco Editor
* WebRTC UI
* Socket.IO Client

### apps/server

Backend application.

Responsible for:

* APIs
* Socket.IO Server
* Room Management
* Redis Integration
* WebRTC Signaling

### packages/

Sharerable contents.

---

# Data Flow

User Action
→ Next.js
→ Socket.IO / API
→ Express Server
→ Redis / MongoDB
→ Response Broadcast
→ Connected Clients

For collaborative editing:

Monaco
→ Yjs
→ Socket.IO
→ Redis Adapter
→ Other Participants

---

# Architectural Guardrails

* Frontend must never access MongoDB directly.
* All persistence must go through the backend API.
* Redis is temporary storage and not a source of truth.
* MongoDB is the system of record.
* CRDT document state is the source of truth for real-time editing.
* Database writes must not occur on every keystroke.
* Authentication must be validated through Clerk before accessing protected resources.
