import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Main routes
  index("routes/_index.tsx"),
  route("/login", "routes/login.tsx"),
  route("/logout", "routes/logout.tsx"),
  route("/register", "routes/register.tsx"),
  route("/dashboard", "routes/dashboard.tsx"),
  
  // User Management routes
  route("/users-management", "routes/users-management.tsx"),
  route("/users-management-v2", "routes/users-management-v2.tsx"),
  
  // Product Management routes
  route("/products-management", "routes/products-management.tsx"),
] satisfies RouteConfig;
