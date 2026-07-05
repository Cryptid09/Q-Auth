# API Documentation

## Quarkus User Service (Internal — Port 8080)

> These endpoints are only called by the Node.js Gateway, never directly by the browser.

---

### POST /users

Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Validation:**
- `email`: Required, must be valid email format
- `password`: Required, minimum 8 characters

**Responses:**

| Status | Description |
|--------|-------------|
| 201 | User created successfully |
| 400 | Validation error |
| 409 | Email already registered |

**201 Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "verified": false,
  "createdAt": "2026-07-04T00:00:00Z"
}
```

**409 Response:**
```json
{
  "error": "Email already registered: user@example.com",
  "status": 409
}
```

---

### POST /users/login

Validate user credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Credentials valid |
| 401 | Invalid email or password |

**200 Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "verified": true,
  "createdAt": "2026-07-04T00:00:00Z"
}
```

---

### GET /users/verify

Verify email using token.

**Query Parameters:**
- `token` (required): The verification token from the email

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Email verified successfully |
| 400 | Invalid or expired token |

**200 Response:**
```json
{
  "message": "Email verified successfully"
}
```

---

### GET /users/{id}

Get user information by ID.

**Path Parameters:**
- `id` (UUID): The user's unique identifier

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | User found |
| 404 | User not found |

---

## Node.js Gateway (Public — Port 3001)

> These are the endpoints that the React frontend calls.

---

### POST /signup

Register a new user. Proxies to Quarkus `POST /users`.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| 201 | Registration successful |
| 400 | Validation error |
| 409 | Email already registered |

**201 Response:**
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "verified": false,
    "createdAt": "2026-07-04T00:00:00Z"
  }
}
```

---

### POST /login

Authenticate user and create session. Proxies to Quarkus `POST /users/login`.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Login successful, session created |
| 401 | Invalid credentials |

**200 Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "verified": true,
    "createdAt": "2026-07-04T00:00:00Z"
  }
}
```

**Headers Set:**
```
Set-Cookie: oppex.sid=...; Path=/; HttpOnly; SameSite=Lax
```

---

### POST /logout

Destroy the session. **Requires authentication.**

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Logged out successfully |
| 401 | Not authenticated |

---

### GET /profile

Get the authenticated user's profile. **Requires authentication.**

Fetches fresh data from Quarkus to ensure verification status is current.

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Profile data |
| 401 | Not authenticated |

**200 Response:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "verified": true,
    "createdAt": "2026-07-04T00:00:00Z"
  }
}
```

---

### GET /verify

Verify email with token. Proxies to Quarkus `GET /users/verify`.

**Query Parameters:**
- `token` (required): The verification token

**Responses:**

| Status | Description |
|--------|-------------|
| 200 | Email verified |
| 400 | Token required / Invalid token |

---

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "oppex-gateway"
}
```

---

## Error Response Format

All errors follow a consistent JSON format:

```json
{
  "error": "Human-readable error message",
  "status": 400
}
```

Validation errors include details:
```json
{
  "error": "Validation failed",
  "details": "register.request.email: Must be a valid email address",
  "status": 400
}
```
