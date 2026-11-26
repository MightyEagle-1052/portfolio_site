/** The login (password or GitHub token) is missing, expired or rejected: show the sign-in screen again. */
export class AuthError extends Error {}

/** The content changed somewhere else since the admin loaded it; saving now would replace that change. */
export class ConflictError extends Error {}
