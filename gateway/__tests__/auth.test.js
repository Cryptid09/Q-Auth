/**
 * Gateway authentication route tests.
 * Uses Supertest with mocked Quarkus client.
 */
const request = require('supertest');
const { createApp } = require('../src/index');

// Mock the Quarkus client to isolate gateway tests from the backend
jest.mock('../src/services/quarkusClient', () => ({
  signup: jest.fn(),
  login: jest.fn(),
  verifyEmail: jest.fn(),
  getUser: jest.fn(),
}));

const quarkusClient = require('../src/services/quarkusClient');

describe('Gateway Auth Routes', () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  describe('POST /signup', () => {
    it('should return 201 on successful registration', async () => {
      const mockUser = { id: 'uuid-123', email: 'test@oppex.dev', verified: false };
      quarkusClient.signup.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/signup')
        .send({ email: 'test@oppex.dev', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body.user).toEqual(mockUser);
      expect(res.body.message).toContain('Registration successful');
      expect(quarkusClient.signup).toHaveBeenCalledWith({
        email: 'test@oppex.dev',
        password: 'password123',
      });
    });

    it('should forward 409 on duplicate email', async () => {
      quarkusClient.signup.mockRejectedValue({
        response: { status: 409, data: { error: 'Email already registered' } },
      });

      const res = await request(app)
        .post('/signup')
        .send({ email: 'existing@oppex.dev', password: 'password123' });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('already registered');
    });
  });

  describe('POST /login', () => {
    it('should return 200 and set session on valid credentials', async () => {
      const mockUser = { id: 'uuid-123', email: 'test@oppex.dev', verified: true };
      quarkusClient.login.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@oppex.dev', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.user).toEqual(mockUser);
      expect(res.body.message).toBe('Login successful');
      // Session cookie should be set
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should forward 401 on invalid credentials', async () => {
      quarkusClient.login.mockRejectedValue({
        response: { status: 401, data: { error: 'Invalid email or password' } },
      });

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@oppex.dev', password: 'wrong' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /logout', () => {
    it('should return 200 and clear session', async () => {
      const mockUser = { id: 'uuid-123', email: 'test@oppex.dev', verified: true };
      quarkusClient.login.mockResolvedValue(mockUser);

      // First login to establish a session
      const agent = request.agent(app);
      await agent.post('/login').send({ email: 'test@oppex.dev', password: 'password123' });

      // Then logout
      const res = await agent.post('/logout');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully');
    });
  });

  describe('GET /profile', () => {
    it('should return 401 when not authenticated', async () => {
      const res = await request(app).get('/profile');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Authentication required');
    });

    it('should return 200 with user data when authenticated', async () => {
      const mockUser = { id: 'uuid-123', email: 'test@oppex.dev', verified: true };
      quarkusClient.login.mockResolvedValue(mockUser);
      quarkusClient.getUser.mockResolvedValue(mockUser);

      const agent = request.agent(app);
      await agent.post('/login').send({ email: 'test@oppex.dev', password: 'password123' });

      const res = await agent.get('/profile');
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('test@oppex.dev');
    });
  });

  describe('GET /verify', () => {
    it('should return 400 when no token provided', async () => {
      const res = await request(app).get('/verify');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Token is required');
    });

    it('should return 200 on valid token', async () => {
      quarkusClient.verifyEmail.mockResolvedValue({ message: 'Email verified successfully' });

      const res = await request(app).get('/verify?token=valid-token');

      expect(res.status).toBe(200);
      expect(quarkusClient.verifyEmail).toHaveBeenCalledWith('valid-token');
    });
  });

  describe('GET /health', () => {
    it('should return 200', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});
