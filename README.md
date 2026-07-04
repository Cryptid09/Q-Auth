# Oppex Authentication Portal

A production-quality, full-stack user authentication system built with a layered architecture.

## Architecture

```
Browser → React Frontend → Node.js Gateway (BFF) → Quarkus User Service → PostgreSQL
                                                           ↓
                                                    Mailpit (Dev SMTP)
```

**React never communicates directly with Quarkus.** The Node.js gateway handles session management, cookies, and proxies all API calls to the backend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router |
| Gateway | Node.js, Express, express-session |
| Backend | Quarkus 3.37, Java 21, Hibernate ORM Panache |
| Database | PostgreSQL 16 |
| Email (Dev) | Mailpit |
| Testing | JUnit 5, Mockito, RestAssured, Jest, Supertest, Vitest, React Testing Library |

## Quick Start

### Prerequisites

- Java 21+
- Node.js 20+
- Docker & Docker Compose

### 1. Start Infrastructure

```bash
docker compose up -d
```

This starts PostgreSQL (port 5433) and Mailpit (SMTP 1025 / UI 8025).

### 2. Start Quarkus Backend

```bash
cd user-service
./mvnw quarkus:dev
```

Backend runs on `http://localhost:8080`.

### 3. Start Node.js Gateway

```bash
cd gateway
npm install
npm run dev
```

Gateway runs on `http://localhost:3001`.

### 4. Start React Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

### 5. View Emails

Open `http://localhost:8025` to see verification emails in Mailpit.

## Project Structure

```
├── docker-compose.yml          # PostgreSQL + Mailpit
├── .env.example                # Environment variables template
├── user-service/               # Quarkus backend (Java 21)
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/example/users/
│       │   ├── resource/       # REST endpoints
│       │   ├── service/        # Business logic
│       │   ├── repository/     # Data access
│       │   ├── entity/         # JPA entities
│       │   ├── dto/            # Request/Response objects
│       │   ├── mapper/         # Entity ↔ DTO conversion
│       │   ├── exception/      # Error handling
│       │   ├── config/         # Configuration
│       │   └── util/           # Utilities
│       └── test/               # JUnit + Mockito tests
├── gateway/                    # Node.js BFF
│   ├── src/
│   │   ├── index.js            # Express app
│   │   ├── config.js           # Configuration
│   │   ├── routes/auth.js      # Auth endpoints
│   │   ├── middleware/         # Session & auth middleware
│   │   └── services/           # Quarkus HTTP client
│   └── __tests__/              # Jest + Supertest tests
├── frontend/                   # React (Vite)
│   ├── src/
│   │   ├── pages/              # Login, Signup, Dashboard, VerifyEmail
│   │   ├── components/         # ProtectedRoute, Layout
│   │   ├── context/            # AuthContext
│   │   └── api/                # Axios client
│   └── __tests__/              # Vitest + React Testing Library
└── docs/                       # Documentation
```

## API Endpoints

### Quarkus (Internal — port 8080)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/users` | Register user |
| POST | `/users/login` | Validate credentials |
| GET | `/users/verify?token=` | Verify email |
| GET | `/users/{id}` | Get user info |

### Gateway (Public — port 3001)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/signup` | No | Register user |
| POST | `/login` | No | Login & create session |
| POST | `/logout` | Yes | Destroy session |
| GET | `/profile` | Yes | Get current user |
| GET | `/verify?token=` | No | Verify email |
| GET | `/health` | No | Health check |

## Running Tests

```bash
# Backend (Quarkus)
cd user-service && ./mvnw test

# Gateway (Node.js)
cd gateway && npm test

# Frontend (React)
cd frontend && npm test
```

## Documentation

- [Architecture](docs/architecture.md)
- [API Documentation](docs/api-docs.md)
- [Testing Guide](docs/testing-guide.md)
- [Deployment Guide](docs/deployment-guide.md)

## License

MIT
