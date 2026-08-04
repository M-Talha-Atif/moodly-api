# Profile Module

`src/users/profile`: authenticated self-service profile endpoints (as opposed to the admin-style CRUD in [`src/users`](../README.md)).

## Structure

```
profile/
├── profile.module.ts
├── controller/
│   └── profile.controller.ts   # @Controller('profile')
├── services/
│   └── profile.service.ts
└── dto/
```

## Endpoints

`@Controller('profile')`, guarded by `JwtCookieGuard` + `RolesGuard`.

| Method | Route | Description |
|---|---|---|
| GET | `/profile` | Fetch the current user's profile |
| GET | `/profile/image` | Fetch the current user's profile image |
| PATCH | `/profile` | Update profile fields (multipart request; avatar file optional) |
| PATCH | `/profile/password` | Change password |

Avatar uploads go through the shared `S3Service` (`src/common/services/s3.service.ts`): see [src/common/README.md](../../common/README.md).
