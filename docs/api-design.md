# API Design - e-edito

## Overview

This document defines all REST APIs used by e-edito.

The API layer is responsible for:

- Room management
- Version management
- User information
- Execution services

Authentication is handled through Clerk.

---

# Rooms

## Create Room

### Endpoint

```http
POST /api/rooms
```

---

## Get Room

### Endpoint

```http
GET /api/rooms/:roomId
```

---

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
POST /api/rooms/:roomId/invite/:userId
```

---

## get Participant

### Endpoint

```http
POST /api/participants/:roomId
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

# Actitity Log

## Get Activity Log for room

### Endpoint

```http
GET /api/logs/:roomId
```

## Get Activity Log for user

### Endpoint

```http
GET /api/logs
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
