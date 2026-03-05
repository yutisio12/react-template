export const APP_CONFIG = {
  name: "SaaS Admin",
  description: "Production-ready SaaS Admin Boilerplate",
  version: "1.0.0",
  jwt: {
    secret: "your-super-secret-jwt-key-change-in-production-min-32-chars!!",
    expiresIn: "1h",
    cookieName: "auth_token",
  },
  totp: {
    issuer: "SaaS Admin",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  },
  api: {
    simulatedDelay: 500,
  },
};

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  mfa: "/mfa",
  dashboard: "/dashboard",
  users: "/dashboard/users",
  admin: "/dashboard/admin",
};
