import axios from 'axios';

/**
 * API client for communicating with the Node.js gateway.
 * In development, Vite's proxy rewrites /api/* to the gateway.
 * In production, set VITE_API_URL to the gateway's URL.
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default client;
