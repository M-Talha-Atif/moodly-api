# Users Module

`src/users`: user persistence and admin-style CRUD. See also [profile](profile/README.md) for the self-service, authenticated user-facing endpoints.

## Structure

```
users/
├── users.module.ts
├── users.controller.ts   # @Controller('users')
├── users.service.ts
├── entities/
│   ├── user.entity.ts     # users table
│   └── privacy.entity.ts  # privacy_settings table
├── mapper/
│   └── user.mapper.ts
└── profile/                # see profile/README.md
```

## Entity notes

`User` (`users` table) carries: email, `passwordHash`, name, `refreshTokenHash`, `onboardingCompleted`, `provider` (`local`/`google`), `avatarUrl`, `culturalBackground` (jsonb), `languagePreferences` (array), `communicationStyle`, `role` (`user`/`host`/`admin`), `accountStatus`, plus relations to bookings, experiences, feedback, and community entities. Password hashing (both here, for OAuth-only accounts that still need a placeholder hash, and in [profile](profile/README.md)) reuses `PASSWORD_HASH_SALT_ROUNDS` from `src/auth/auth.constants.ts` rather than a separate constant, since it's the same concept.

`PrivacySetting` (`privacy_settings` table, 1:1 with `User`): `dataSharingLevel`, `communityVisibility`, `trackingConsent`.

## Endpoints

`@Controller('users')`: **no guards applied** on this controller; it is effectively unauthenticated admin-style CRUD today. Treat as internal/admin-only until guards are added, or drive user-facing reads/writes through [`/profile`](profile/README.md) instead.

| Method | Route | Description |
|---|---|---|
| POST | `/v1/users` | Create a user |
| GET | `/v1/users` | List all users |
| GET | `/v1/users/:id` | Get a user by id |
| PATCH | `/v1/users/:id` | Update a user |
| DELETE | `/v1/users/:id` | Delete a user |
