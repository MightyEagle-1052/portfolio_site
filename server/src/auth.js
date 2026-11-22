import crypto from 'node:crypto';
import { config } from './config.js';

const b64url = (buf) => Buffer.from(buf).toString('base64url');
const sign = (data) => crypto.createHmac('sha256', config.tokenSecret).update(data).digest('base64url');

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function checkPassword(password) {
  return Boolean(config.adminPassword) && safeEqual(password ?? '', config.adminPassword);
}

export function issueToken() {
  const payload = b64url(JSON.stringify({ sub: 'admin', exp: Date.now() + config.tokenTtlMs }));
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token) {
  if (typeof token !== 'string') return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!verifyToken(token)) return res.status(401).json({ error: 'Not authorized. Please log in again.' });
  next();
}

/** Simple in-memory brute-force protection for the login endpoint. */
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 8;

export function loginLimiter(req, res, next) {
  const key = req.ip;
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry && now - entry.first > WINDOW_MS) attempts.delete(key);
  const current = attempts.get(key);
  if (current && current.count >= MAX_FAILS) {
    return res.status(429).json({ error: 'Too many failed attempts. Try again in a few minutes.' });
  }
  res.on('finish', () => {
    if (res.statusCode === 401) {
      const e = attempts.get(key) || { count: 0, first: now };
      e.count += 1;
      attempts.set(key, e);
    } else if (res.statusCode === 200) {
      attempts.delete(key);
    }
  });
  next();
}
