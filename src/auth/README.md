# Auth Module

`src/auth`: email/password authentication with JWT access+refresh tokens, plus Google OAuth 2.0.

## Structure

```
auth/
├── auth.module.ts        # registers JwtModule globally, PassportModule
├── auth.controller.ts    # @Controller('auth')
├── auth.service.ts       # token generation, bcrypt hashing, refresh rotation
├── auth.constants.ts     # bcrypt cost factors, token expiries, cookie max age
├── dto/                  # signup/login request DTOs
├── guards/
│   ├── jwt-cookie.guard.ts   # JwtCookieGuard: reads `jwt` httpOnly cookie, falls back to Bearer header
│   └── jwt-bearer.guard.ts   # JwtBearerGuard: Bearer header only
└── strategies/
    └── google.strategy.ts    # Passport Google OAuth2 strategy
```

## How it works

- **Signup/login**: bcrypt password hashing (`PASSWORD_HASH_SALT_ROUNDS = 12` in `auth.constants.ts`). On success, `generateTokens()` signs an access token (`{sub, email, role}`, secret `JWT_SECRET`) and a refresh token (`{sub}`, secret `JWT_REFRESH_SECRET`): both currently set to a **7-day** expiry (`ACCESS_TOKEN_EXPIRY`/`REFRESH_TOKEN_EXPIRY`). The refresh token is bcrypt-hashed at a lower cost (`REFRESH_TOKEN_HASH_SALT_ROUNDS = 10`) and stored on the `User` row, the gap between the two cost factors was found as-is, not a documented design choice, see `auth.constants.ts` for the note.
- **Cookie**: the access token is also set as an httpOnly cookie named `jwt` (`secure` in production, `sameSite: 'strict'`, `maxAge: 24h`). Note the cookie expires (24h) well before the JWT itself does (7d): a re-login is forced by the cookie disappearing, not by token expiry.
- **Refresh**: `POST /auth/refresh` verifies the refresh JWT, compares its hash against the stored one, and rotates both tokens (issues new ones, re-hashes and re-stores the new refresh token).
- **Google OAuth**: `GET /auth/google` kicks off the Passport flow; `GET /auth/google/callback` finds-or-creates a user by email and redirects to `FRONTEND_URL` with the `jwt` cookie set.
- **Logout**: nulls the stored refresh-token hash, so the old refresh token can no longer be redeemed even if the cookie/localStorage copy leaks.

Requires `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`: `GoogleStrategy`'s constructor throws at boot if any are missing.

## Endpoints

`@Controller('auth')`

| Method | Route | Guard | Description |
|---|---|---|---|
| POST | `/auth/signup` | – | Register a new user (email, password, name) |
| POST | `/auth/login` | – | Login, sets `jwt` httpOnly cookie, returns tokens |
| POST | `/auth/refresh` | – | Verify refresh token, rotate access+refresh tokens |
| POST | `/auth/logout` | – | Clear stored refresh-token hash |
| GET | `/auth/google` | `AuthGuard('google')` | Start Google OAuth flow |
| GET | `/auth/google/callback` | `AuthGuard('google')` | OAuth callback: find-or-create user, set cookie, redirect to `FRONTEND_URL` |
| GET | `/auth/me` | `JwtCookieGuard` | Return the currently authenticated user |

## Guards used elsewhere

- `JwtCookieGuard`: the primary guard used across the app; reads the `jwt` cookie, or `Authorization: Bearer <token>` if no cookie is present.
- `JwtBearerGuard`: Bearer-header-only. Frequently stacked together with `JwtCookieGuard` on the same route (e.g. `@UseGuards(JwtBearerGuard, JwtCookieGuard, RolesGuard)`), which is redundant since `JwtCookieGuard` alone already accepts a Bearer header.
- `RolesGuard` (`src/common/roles.guard.ts`): reads `@Roles('host' | 'user' | 'admin')` metadata and checks `request.user.role`.
