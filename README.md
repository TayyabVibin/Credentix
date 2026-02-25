# Credentix

Credit-Based SaaS Platform with Enterprise-Grade Adyen Payment Core

## Prerequisites

- Node.js 20+
- npm
- Docker & Docker Compose (optional, for containerized setup)
- PostgreSQL 15 (when running locally without Docker)

## Quick Start

### 1. Clone and install

```bash
cd Credentix
cp .env.example .env
# Edit .env with your values (JWT_SECRET required for Sprint 1)
```

### 2. Backend

```bash
cd backend
npm install
# Ensure PostgreSQL is running, set DATABASE_URL in .env
npm run start:dev
```

Backend runs at http://localhost:3000

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

### 4. Docker (optional)

```bash
# Start PostgreSQL only (for local dev)
docker compose up -d postgres

# Or run everything
docker compose up
```

## Project Structure

```
Credentix/
├── backend/          # NestJS API
├── frontend/         # React + MUI + Redux
├── docker-compose.yml
└── .env.example
```

## Sprints

- **Sprint 1:** Foundation – DB schema, User module, auth
- **Sprint 2:** Payment core – Adyen, webhooks, state machine
- **Sprint 3:** Wallet & purchase flow
- **Sprint 4:** Frontend – User experience
- **Sprint 5:** Admin & observability
- **Sprint 6:** Security, testing, polish

## Environment Variables

See `.env.example` for required variables. For Sprint 1, you need:

- `DATABASE_URL` – PostgreSQL connection string
- `JWT_SECRET` – Secret for JWT signing
- `JWT_EXPIRES_IN` – e.g. `7d`
