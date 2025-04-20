import { createCookieSessionStorage } from '@remix-run/node';

// Create the session storage (can use cookies, etc.)
const sessionSecret = process.env.SESSION_SECRET || "defaultSecret"; // Provide a default if undefined

if (!sessionSecret) {
  throw new Error('SESSION_SECRET is required but not set in environment variables.');
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: 'dashboard_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
  },
});

export { getSession, commitSession, destroySession };
