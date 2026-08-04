# Community Module

`src/community`: groups (communities), membership, posts, reactions, and comments. A single controller handles all of it, with per-route guards rather than a controller-level guard.

## Structure

```
community/
├── community.module.ts
├── community.constants.ts    # pagination defaults, one per listing type (members/posts/comments/list)
├── community.controller.ts   # @Controller('communities'): every route below
├── services/
│   ├── community/
│   │   ├── community.service.ts        # host CRUD, owner checks
│   │   ├── community-query.service.ts  # public/authenticated listing, categories
│   │   └── community-member.service.ts # join/leave/list members
│   ├── posts/
│   │   ├── community-post.service.ts
│   │   └── reactions/
│   │       └── community-reaction.service.ts
│   └── comments/
│       └── community-comment.service.ts
├── entities/
│   ├── community/
│   │   ├── community.entity.ts          # `communities` table
│   │   └── community-member.entity.ts
│   └── posts/
│       ├── community-post.entity.ts
│       ├── comments/community-comment.entity.ts
│       └── reactions/community-reaction.entity.ts
├── dto/
└── mapper/
```

## Entity notes

`Community` (`communities` table): `name` (unique), description, `coverImageUrl`, `category`, `isPrivate`, `rules`, `location`, `tags`, `memberCount`, `owner` (eager `ManyToOne` `User`).

## Endpoints

All under `@Controller('communities')`; guards are applied per-route (this controller has no controller-level `@UseGuards`).

### Host CRUD: `JwtCookieGuard, RolesGuard`, role `host`

| Method | Route | Description |
|---|---|---|
| POST | `/communities` | Create a community |
| PATCH | `/communities/:id` | Update (owner-only check) |
| DELETE | `/communities/:id` | Delete (owner-only check) |

### Public: no guard

| Method | Route | Description |
|---|---|---|
| GET | `/communities/public` | List communities, filterable by `page`, `limit`, `category`, `isPrivate`, `tags`, `search` |
| GET | `/communities/:id` | Get a single community |
| GET | `/communities/public/categories` | List all distinct categories |

### Membership: `JwtCookieGuard`

| Method | Route | Description |
|---|---|---|
| POST | `/communities/:id/join` | Join a community |
| POST | `/communities/:id/leave` | Leave a community |
| GET | `/communities/:id/members` | List members (no guard) |
| GET | `/communities` | Authenticated listing, each result annotated with `isJoined` |
| GET | `/communities/joined/count` | Count of communities the caller has joined |

### Posts: `JwtCookieGuard`

| Method | Route | Description |
|---|---|---|
| POST | `/communities/:id/posts` | Create a post `{ content, mediaUrl? }` |
| GET | `/communities/:id/posts` | List posts, paginated (`page`, `limit`) |
| GET | `/communities/posts/:id` | Get a single post |
| DELETE | `/communities/posts/:id` | Delete a post (author only) |

### Reactions: `JwtCookieGuard`

| Method | Route | Description |
|---|---|---|
| PUT | `/communities/posts/:id/reaction` | Upsert the caller's reaction on a post (idempotent: `{ type }`) |
| DELETE | `/communities/posts/:id/reaction` | Remove the caller's reaction |
| GET | `/communities/posts/:id/reactions` | Aggregated reaction counts + the caller's own reaction |

### Comments: mixed guards

| Method | Route | Guard | Description |
|---|---|---|---|
| POST | `/communities/posts/:id/comments` | `JwtCookieGuard` | Add a comment `{ content }` |
| GET | `/communities/posts/:id/comments` | – | List comments, cursor-paginated (`cursor`, `limit`) |
| DELETE | `/communities/posts/comments/:commentId` | `JwtCookieGuard` | Delete a comment (author only) |

> Route ordering note: `GET /communities/:id` (public, param route) is registered before the more specific `GET /communities/public/categories` and `GET /communities/posts/:id` handlers in the controller class, but Nest matches literal path segments before wildcard `:id` params regardless of declaration order for `@Get()` handlers within a controller: still, if you add new literal sub-paths under `/communities/`, register them so they aren't shadowed by an earlier `:id` capture.
