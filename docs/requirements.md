# Real-Time Collaborative Code Editor

## 1. Project Overview

The e-edito is a Real-Time Collaborative Code Editor web-based platform that enables multiple users to write, edit, and execute code simultaneously within shared rooms. The platform supports real-time collaboration using CRDT-based synchronization, live chat, audio/video communication, version management, and role-based participant control.

The primary objective of the system is to provide a seamless collaborative programming environment similar to modern online coding platforms while ensuring scalability, fault tolerance, and low-latency communication.

---

# 2. Functional Requirements

## 2.1 User Authentication

* Users shall be able to register and log in securely using Clerk Authentication.
* The system shall maintain authenticated user sessions.
* The system shall support logout functionality.
* User profile information shall be synchronized with the application database through webhooks.

---

## 2.2 Room Management

### Create Room

* Authenticated users shall be able to create new collaboration rooms.
* The room creator shall become the room owner.
* Each room shall have:

  * Unique room code
  * Room name
  * Description
  * Programming language selection

### Join Room

* Users shall be able to join existing rooms using a room code.
* Users shall be able to join rooms through invitation links.
* The system shall validate room access permissions before allowing entry.

### Recent Rooms

* Users shall be able to view recently joined rooms.
* Users shall be able to rejoin previously visited rooms.

---

## 2.3 Real-Time Collaborative Editing

* Multiple users shall be able to edit code simultaneously.
* Code changes shall be synchronized in real time.
* The system shall resolve editing conflicts using CRDT (Yjs).
* Users shall be able to view active collaborators in a room.
* The system shall display collaborator presence information.
* Cursor positions and text selections shall be synchronized among participants.

---

## 2.4 Chat System

* Participants shall be able to exchange text messages in real time.
* Messages shall be stored for future retrieval.
* Users shall receive messages instantly without page refresh.
* System messages shall be generated for room activities such as:

  * User joined
  * User left
  * User removed
  * Video call started

---

## 2.5 Audio and Video Communication

* Participants shall be able to initiate audio calls.
* Participants shall be able to initiate video calls.
* Participants shall be able to mute/unmute audio.
* Participants shall be able to enable/disable video streams.
* Real-time communication shall be implemented using WebRTC.

---

## 2.6 Code Execution

* Users shall be able to execute code directly from the editor.
* The system shall support multiple programming languages.
* Execution output shall be displayed within the application.
* The system shall isolate code execution environments for security purposes.

---

## 2.7 Version Management

* Users shall be able to manually save code versions.
* The system shall maintain a version history.
* Users shall be able to restore previously saved versions.
* Version metadata shall include:

  * Version creator
  * Timestamp
  * Save reason

---

## 2.8 Participant Management

### Room Owner Permissions

The room owner shall be able to:

* Invite participants
* Remove participants
* Ban participants
* Assign participant roles
* Promote participants to editor role
* Restrict participants to viewer role

### Participant Roles

* Owner
* Editor
* Viewer

---

## 2.9 Activity Tracking

The system shall maintain activity logs for:

* Room creation
* Room joining
* Room leaving
* Version creation
* Participant removal
* Role modifications

---

# 3. Non-Functional Requirements

## 3.1 Performance

* The system shall support at least 100 concurrent users within a single room.
* The system shall support at least 100 active rooms simultaneously.
* The system shall support at least 5000 registered users.
* The average API response time shall remain below 200 milliseconds under normal load.
* Real-time synchronization latency shall remain below 100 milliseconds.

---

## 3.2 Scalability

* The architecture shall support horizontal scaling.
* The system shall be capable of handling at least 2x projected growth without architectural redesign.
* Redis Pub/Sub shall be used for distributed event communication.
* Socket.IO Redis Adapter shall support multi-instance deployment.

---

## 3.3 Reliability

* The system shall provide fault-tolerant communication.
* Temporary server failures shall not result in permanent data loss.
* Room state shall be recoverable after service interruptions.
* Automatic reconnection shall be supported for disconnected clients.

---

## 3.4 Security

* All communication shall occur over HTTPS and WSS.
* Authentication shall be handled through Clerk.
* Sensitive data shall be encrypted during transmission.
* User permissions shall be validated before performing room operations.
* Code execution shall be isolated to prevent unauthorized access.

---

## 3.5 Availability

* The system shall target high availability.
* Critical services shall remain operational during partial system failures.
* Redis shall be used for maintaining real-time state and presence information.

---

## 3.6 Maintainability

* The system shall follow a modular architecture.
* Business logic, real-time communication, and persistence layers shall be separated.
* Logging and monitoring shall be implemented for debugging and observability.

---

# 4. Success Criteria

The project shall be considered successful if:

* Users can collaboratively edit code in real time.
* Synchronization remains consistent under concurrent editing.
* Rooms support at least 100 active users.
* Audio/video communication works reliably.
* Version history can be saved and restored.
* The system remains responsive under expected load.
* Data integrity is maintained during failures and reconnections.
