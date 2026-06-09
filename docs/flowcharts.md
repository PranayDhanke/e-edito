# Flowcharts

## Authentication Flow

```mermaid
flowchart TD

User --> ClerkLogin

ClerkLogin --> Clerk

Clerk --> Webhook

Webhook --> Express

Express --> MongoDB

MongoDB --> Dashboard
```

---

## Room Creation Flow

```mermaid
flowchart TD

User --> CreateRoom

CreateRoom --> NextJS

NextJS --> ExpressAPI

ExpressAPI --> MongoDB

MongoDB --> RoomCreated

RoomCreated --> JoinRoom
```

---

## Room Join Flow

```mermaid
flowchart TD

User --> EnterRoomCode

EnterRoomCode --> NextJS

NextJS --> ExpressAPI

ExpressAPI --> ValidateRoom

ValidateRoom --> MongoDB

MongoDB --> Success

Success --> SocketConnection

SocketConnection --> CollaborationStarted
```

---

## Collaboration Flow Diagram

```mermaid
sequenceDiagram

participant A as User A
participant YA as Yjs Client A
participant S as Socket.IO
participant R as Redis Adapter
participant Y as Yjs Server
participant YB as Yjs Client B
participant B as User B

A->>YA: Edit Code

YA->>S: CRDT Update

S->>R: Publish Update

R->>Y: Broadcast Update

Y->>YB: Sync Document

YB->>B: Render Changes
```

---

## Chat Flow

```mermaid
sequenceDiagram

participant User
participant Client
participant Socket
participant MongoDB
participant Room

User->>Client: Send Message

Client->>Socket: message event

Socket->>MongoDB: Save Message

Socket->>Room: Broadcast Message

Room->>User: Receive Message
```

---

## Version Save Flow

```mermaid
flowchart TD

Editor --> SaveVersion

SaveVersion --> API

API --> MongoDB

MongoDB --> VersionStored

VersionStored --> Success
```

---

## Code Execution Flow

```mermaid
flowchart TD

User --> RunCode

RunCode --> ExpressAPI

ExpressAPI --> ExecutionService

ExecutionService --> Sandbox

Sandbox --> ExecuteCode

ExecuteCode --> Output

Output --> User
```

---

## Video Call Flow

```mermaid
sequenceDiagram

participant UserA
participant SignalServer
participant UserB
participant WebRTC

UserA->>SignalServer: Create Offer

SignalServer->>UserB: Forward Offer

UserB->>SignalServer: Answer Offer

SignalServer->>UserA: Forward Answer

UserA->>UserB: Exchange ICE Candidates

UserA->>WebRTC: Establish Connection

UserB->>WebRTC: Establish Connection
```

---

## Room Lifecycle Diagram

```mermaid
flowchart LR

CreateRoom --> JoinRoom

JoinRoom --> Collaborate

Collaborate --> Chat

Collaborate --> VideoCall

Collaborate --> ExecuteCode

Collaborate --> SaveVersion

SaveVersion --> RestoreVersion

Collaborate --> LeaveRoom
```

---

## Persistence Flow

```mermaid
flowchart TD

Editor[Monaco Editor]

Editor --> Yjs

Yjs --> SocketIO

SocketIO --> Redis

SocketIO --> Debounce

Debounce --> MongoDB

MongoDB --> Versions

MongoDB --> Messages

MongoDB --> Rooms
```
