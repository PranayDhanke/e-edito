# e-edito

A real-time collaborative code editor built with Next.js, Express.js, Socket.IO, Redis, MongoDB, and Yjs CRDT.

## Features

* Real-time collaborative editing
* CRDT-based synchronization with Yjs
* Room-based collaboration
* Real-time chat
* Audio and video communication
* Code execution
* Version management
* Participant management
* Clerk authentication

## Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Monaco Editor

### Backend

* Express.js
* Socket.IO

### Infrastructure

* MongoDB
* Redis
* BullMQ
* Clerk
* Yjs

## Installation

### Clone Repository

```bash
git clone https://github.com/PranayDhanke/e-edito.git

cd e-edito
```

### Install Dependencies

```bash
pnpm install
```

### Configure Environment Variables

Create environment files from the provided examples.

```bash
cp apps/web/.env.example apps/web/.env

cp apps/server/.env.example apps/server/.env
```

Refer [.env.example](./.env.example) fro the .env in web and server

### Run Development Environment

```bash
pnpm dev
```

## Documentation

Detailed documentation is available in the `docs` directory.

* [Requirements](./docs/requirements.md)
* [Architecture](./docs/architecture.md)
* [Database Design](./docs/database-design.md)
* [Redis Design](./docs/redis-design.md)
* [Flowcharts](./docs/flowcharts.md)
* [Socket Events](./docs/socket-events.md)
* [API Design](./docs/api-design.md)

