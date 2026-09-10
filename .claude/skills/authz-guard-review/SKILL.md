---
name: authz-guard-review
description: Review a NestJS controller (new or changed) in this repo for auth/authz correctness. Use before merging any change that adds a controller, adds a route, or touches @UseGuards/@Roles. This project has shipped two real authorization bypasses from exactly the mistakes this checklist catches, treat every finding as a real bug until proven otherwise, not a style nit.
---

# Auth/authz guard review

This project had two live authorization bugs, both from patterns that look correct at a glance:
booking, experience, and recommendation endpoints stacked `JwtBearerGuard` with `JwtCookieGuard`
and silently rejected every cookie-only request, and `POST /v1/notification` carried `@Roles('host')`
with no `RolesGuard` in the chain, so any authenticated user of any role could call it. Both shipped,
both passed code review, both were only caught by actually booting the app and hitting the routes.
Read every controller against this list line by line, don't skim.

## 1. Guard stacking: JwtBearerGuard + JwtCookieGuard together is almost always wrong

`JwtCookieGuard` (`src/auth/guards/jwt-cookie.guard.ts`) already reads the `jwt` cookie and falls
back to the `Authorization` header if no cookie is present. It alone covers both cookie and bearer
clients. NestJS guards in `@UseGuards(...)` are AND-composed and run in the order listed. If a
controller has:

```ts
@UseGuards(JwtBearerGuard, JwtCookieGuard, RolesGuard)
```

`JwtBearerGuard` runs first and throws `401` on any request with no `Authorization` header, before
`JwtCookieGuard` gets a chance to accept the cookie. This silently breaks every cookie-only client
(the primary browser flow) on that controller.

**Flag it whenever you see `JwtBearerGuard` anywhere in the same `@UseGuards(...)` as
`JwtCookieGuard`.** The fix is almost always to drop `JwtBearerGuard` entirely, `JwtCookieGuard`
already does its job. If a route genuinely needs bearer-only semantics different from the cookie
fallback, that needs one guard with real OR logic, not two ANDed guards, flag it as a design
question rather than approving it as-is.

## 2. `@Roles(...)` without `RolesGuard` in the same `@UseGuards(...)` is a silent no-op

`@Roles('host')` only sets reflector metadata. Nothing reads it unless `RolesGuard`
(`src/common/roles.guard.ts`) is also in the guard chain. A route with `@Roles('host')` and only
`JwtCookieGuard` accepts any authenticated user, any role. Grep every `@Roles(` in the diff and
confirm `RolesGuard` is present on the same controller or route. This is easy to miss because the
code reads as if the restriction exists.

## 3. Every new or changed route needs an explicit guard decision, not a default

For each route added or touched, answer out loud:
- Should this be public? If yes, that's a deliberate choice (matches `src/experience/controllers/experience.public.controller.ts`'s pattern), not an oversight, say so in the review.
- Does it need `JwtCookieGuard` alone (any authenticated user), or `JwtCookieGuard` + `RolesGuard` + `@Roles(...)` (role-restricted)?
- If it reads or writes a specific user's data (a booking, a mood log, a notification), does the handler scope the query by the authenticated user's own ID (`req.user.sub`), or could any authenticated user pass someone else's ID and read/modify their data? `users.controller.ts` had zero guards for exactly this reason, full CRUD on every user, unauthenticated. Ownership checks belong in the service layer query, not just the guard.

## 4. `RolesGuard` itself: confirm it fails closed

`src/common/roles.guard.ts` should reject when `request.user` is missing entirely, not just when the
role doesn't match. `!requiredRoles.includes(user.role)` throws a raw `TypeError` (`500`) instead of
a clean `403` if `user` is ever undefined, e.g. a future route pairs `@Roles` with a broken or
missing auth guard. If you're touching this file, keep the `!user ||` guard at the top of the check.

## 5. Cross-reference against a working example before approving

`src/notification/notification.controller.ts` and `src/booking/controller/user-booking.controller.ts`
now have the correct pattern after the fixes above. When reviewing a new controller, diff its guard
setup against one of these rather than trusting that it "looks similar enough" to what's already there.

## What to report

For each finding: the exact route, the exact guard chain as written, what request would incorrectly
succeed or incorrectly fail because of it, and the one-line fix. Don't report "guards look fine" as a
finding, if nothing's wrong, say that plainly and move on.
