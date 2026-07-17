# MediDoc API

NestJS API for authentication, patients, clinics, hospitals, laboratories, management, support tickets, MySQL, and Redis.

Run commands from the repository root with `npm run dev:backend` and `npm run build:backend`, or use the scripts in this directory's `package.json` directly.

## Redis

The API uses Redis for dashboard caching and short-lived OTP storage. Configure it in `backend/.env`:

```env
REDIS_URL=redis://127.0.0.1:6379
REDIS_CACHE_TTL_SECONDS=300
```

Redis is optional during development: if it is unavailable, the API logs a warning and falls back to MySQL. Once the backend is running, check the connection at `GET /api/health/redis`.
