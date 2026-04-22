// lib/auth.js

export function parseJwt(token: String) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: String) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000); // in seconds
  return payload.exp < currentTime;
}

export function getToken() {
  return localStorage.getItem('token'); // or wherever you store it
}

export function clearToken() {
  localStorage.removeItem('token');
}