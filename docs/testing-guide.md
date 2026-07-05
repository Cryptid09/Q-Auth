# Testing Guide

## Overview

The project has three test suites covering all layers of the architecture:

| Layer | Framework | Test Type |
|-------|-----------|-----------|
| Quarkus Backend | JUnit 5 + RestAssured + Mockito | Unit + Integration |
| Node.js Gateway | Jest + Supertest | Integration (mocked backend) |
| React Frontend | Vitest + React Testing Library | Component tests |

## Prerequisites

- Docker containers running (PostgreSQL needed for backend integration tests)
- Node.js dependencies installed (`npm install` in gateway/ and frontend/)

```bash
# Start infrastructure
docker compose up -d
```

---

## Backend Tests (Quarkus)

### Run all tests
```bash
cd user-service
./mvnw test
```

### Test classes

#### `UserResourceTest` (Integration)
Uses `@QuarkusTest` with RestAssured to test HTTP endpoints against a real database.

| Test | What it validates |
|------|------------------|
| `registerNewUser_shouldReturn201` | Successful registration returns 201 + Location header |
| `registerDuplicateEmail_shouldReturn409` | Duplicate email returns 409 |
| `registerWithInvalidEmail_shouldReturn400` | Invalid email format validation |
| `registerWithShortPassword_shouldReturn400` | Password minimum length validation |
| `loginSuccess_shouldReturn200` | Valid credentials return user data |
| `loginWrongPassword_shouldReturn401` | Wrong password returns 401 |
| `loginNonExistentUser_shouldReturn401` | Non-existent email returns 401 |
| `getUserById_shouldReturn200` | Fetch user by UUID |
| `verifyWithInvalidToken_shouldReturn400` | Invalid verification token returns 400 |
| `getNonExistentUser_shouldReturn404` | Non-existent user UUID returns 404 |

#### `UserServiceTest` (Unit)
Uses `@InjectMock` to test business logic in isolation.

| Test | What it validates |
|------|------------------|
| `register_shouldHashPasswordAndPersist` | Password hashing, persistence, email sending |
| `register_withDuplicateEmail_shouldThrow409` | Duplicate detection, no persistence |
| `login_withValidCredentials_shouldReturnUser` | Successful credential validation |
| `login_withWrongPassword_shouldThrow401` | BCrypt mismatch handling |
| `login_withNonExistentEmail_shouldThrow401` | Missing user handling |
| `verifyEmail_withValidToken_shouldMarkVerified` | Token lookup, verified flag, token invalidation |
| `verifyEmail_withInvalidToken_shouldThrow400` | Missing token handling |

#### `PasswordServiceTest` (Unit)
| Test | What it validates |
|------|------------------|
| `hashPassword_shouldProduceBCryptHash` | Output is valid BCrypt format |
| `verifyPassword_shouldMatchCorrectPassword` | Round-trip hash + verify |
| `verifyPassword_shouldNotMatchWrongPassword` | Wrong password rejection |
| `hashPassword_shouldGenerateUniqueSalts` | Unique salts per hash |

### Notes
- Integration tests use `drop-and-create` schema generation (see `src/test/resources/application.properties`)
- The mailer is mocked in test mode (`quarkus.mailer.mock=true`)
- Tests are ordered with `@TestMethodOrder` to ensure registration happens before login

---

## Gateway Tests (Node.js)

### Run all tests
```bash
cd gateway
npm test
```

### Test file: `__tests__/auth.test.js`

Uses Supertest with a mocked Quarkus client (no real backend needed).

| Test | What it validates |
|------|------------------|
| `POST /signup — 201` | Successful registration forwarding |
| `POST /signup — 409` | Duplicate email error forwarding |
| `POST /login — 200` | Login + session cookie creation |
| `POST /login — 401` | Invalid credentials forwarding |
| `POST /logout — 200` | Session destruction |
| `GET /profile — 401` | Unauthenticated access blocked |
| `GET /profile — 200` | Authenticated access with fresh data |
| `GET /verify — 400` | Missing token validation |
| `GET /verify — 200` | Valid token forwarding |
| `GET /health — 200` | Health check |

---

## Frontend Tests (React)

### Run all tests
```bash
cd frontend
npm test
```

### Test files

#### `Login.test.jsx`
| Test | What it validates |
|------|------------------|
| Renders form | Email + password fields + submit button |
| Error on failure | Error message displayed |
| Navigation on success | Redirects to /dashboard |
| Signup link | Link to registration page |

#### `Signup.test.jsx`
| Test | What it validates |
|------|------------------|
| Renders form | Email + password fields + submit button |
| Success message | "Registration successful" after signup |
| Error on duplicate | "Already registered" error |

#### `Dashboard.test.jsx`
| Test | What it validates |
|------|------------------|
| Unverified message | Shows "You need to validate your email..." |
| Verified message | Shows "Your email is validated..." |
| User email display | Shows the user's email |

#### `ProtectedRoute.test.jsx`
| Test | What it validates |
|------|------------------|
| Redirect when unauthenticated | Navigates to /login |
| Render when authenticated | Shows protected content |

---

## Running All Tests

```bash
# From the project root
cd user-service && ./mvnw test && cd ..
cd gateway && npm test && cd ..
cd frontend && npm test && cd ..
```
