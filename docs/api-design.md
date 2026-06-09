# API Design - e-edito

## Overview

This document defines all REST APIs used by e-edito.

The API layer is responsible for:

* Room management
* Version management
* User information
* Execution services

Authentication is handled through Clerk.

---

# Rooms

## Create Room

### Endpoint

```http
POST /api/rooms
```

### Request

```json
{
  "name": "DSA Practice",
  "description": "Interview preparation room",
  "language": "typescript"
}
```

### Response

```json
{
  "roomId": "123",
  "roomCode": "ABC123"
}
```

---

## Get Room

### Endpoint

```http
GET /api/rooms/:roomId
```

---

## Get Recent Rooms

### Endpoint

```http
GET /api/rooms/recent
```

---

## Join Room

### Endpoint

```http
POST /api/rooms/:roomId/join
```

---

## Leave Room

### Endpoint

```http
POST /api/rooms/:roomId/leave
```

---

## Delete Room

### Endpoint

```http
DELETE /api/rooms/:roomId
```

Owner only.

---

# Participants

## Invite Participant

### Endpoint

```http
POST /api/rooms/:roomId/invite
```

---

## Remove Participant

### Endpoint

```http
POST /api/rooms/:roomId/remove
```

---

## Ban Participant

### Endpoint

```http
POST /api/rooms/:roomId/ban
```

---

## Update Participant Role

### Endpoint

```http
PATCH /api/rooms/:roomId/participants/:participantId
```

---

# Versions

## Create Version

### Endpoint

```http
POST /api/versions
```

### Request

```json
{
  "roomId": "123",
  "name": "Before Refactor"
}
```

---

## Get Versions

### Endpoint

```http
GET /api/versions/:roomId
```

---

## Restore Version

### Endpoint

```http
POST /api/versions/:versionId/restore
```

---

# Messages

## Get Room Messages

### Endpoint

```http
GET /api/messages/:roomId
```

---

# Code Execution

## Execute Code

### Endpoint

```http
POST /api/execute
```

### Request

```json
{
  "language": "typescript",
  "code": "console.log('Hello World')"
}
```

### Response

```json
{
  "output": "Hello World",
  "status": "SUCCESS"
}
```

---

## Get Execution History

### Endpoint

```http
GET /api/executions/:roomId
```

---

# Users

## Get Current User

### Endpoint

```http
GET /api/users/me
```

---

## Get User Profile

### Endpoint

```http
GET /api/users/:userId
```

---

# Health Checks

## API Health

### Endpoint

```http
GET /health
```

### Response

```json
{
  "status": "ok"
}
```
