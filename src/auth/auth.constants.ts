// Bcrypt cost factors. Password hashes use a higher cost since they are long-lived secrets;
// refresh token hashes use a lower cost since they rotate on every refresh. This gap was not
// a documented design decision when found, kept as-is here rather than silently unified.
export const PASSWORD_HASH_SALT_ROUNDS = 12;
export const REFRESH_TOKEN_HASH_SALT_ROUNDS = 10;

// Both access and refresh tokens currently share the same lifetime. An access token this
// long-lived is unusual (they're normally short, with the refresh token doing the renewing),
// kept as-is here since shortening it is a behavior change, not a refactor.
export const ACCESS_TOKEN_EXPIRY = '7d';
export const REFRESH_TOKEN_EXPIRY = '7d';

// Default sign options for JwtModule. AuthService.generateTokens always passes an explicit
// expiresIn per call, so this default is effectively unused today.
export const DEFAULT_JWT_SIGN_EXPIRY = '1d';

// Shorter than ACCESS_TOKEN_EXPIRY on purpose from the app's point of view: losing the cookie
// forces a fresh login well before the JWT itself would expire, even though the JWT would still
// be valid if presented manually.
export const AUTH_COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
