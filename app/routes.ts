import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Main routes
  index("routes/_index.tsx"),
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/dashboard", "routes/dashboard.tsx"),
  route("/demo", "routes/demo.tsx"),
  route("/pagination-test", "routes/pagination-test.tsx"),
  route("/users-management", "routes/users-management.tsx"),
] satisfies RouteConfig;
