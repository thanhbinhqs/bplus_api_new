---
applyTo: '**'
---
# Remix Instructions
# AI Instructions for Remix Project

## 1. General Rules
- Response language: **English**.
- Always provide clear explanations and complete code examples where possible.
- Code must be **compatible with Remix v2+**.
- Prefer **TypeScript** over JavaScript.
- Use **ESM modules** (`import/export`), do not use `require`.

## 2. UI and Components
- Use **Tailwind CSS** for styling.
- UI components:
  - Prefer **shadcn/ui** or **Radix UI** for interactive components.
  - Tables: use `@tanstack/react-table` or shadcn Table component.
  - Toast/Notification: use shadcn Toast or Radix Toast.
- All UI must be **responsive** (mobile-first).

## 3. Project Structure
- `app/routes/`:  
  Organize by feature or resource. Follow Remix conventions for nested routes, layouts, and dynamic segments.
  
  ### 3.1 Route Types
  - **Index Route**:  
    File: `app/routes/resource._index.tsx`  
    Purpose: Default page for a route folder.  
    Example:
    ```ts
    // app/routes/posts._index.tsx
    export default function PostsIndex() {
      return <div>List of posts</div>;
    }
    ```
  
  - **Nested Route**:  
    Folder: `app/routes/dashboard/`  
    Each sub-route shares a parent layout.  
    Example:
    ```
    app/routes/dashboard.tsx         → parent layout
    app/routes/dashboard.stats.tsx   → nested route
    app/routes/dashboard.users.tsx   → nested route
    ```

  - **Dynamic Route**:  
    Syntax: `$param.tsx`  
    Purpose: Capture URL parameters.  
    Example:
    ```
    app/routes/posts.$postId.tsx
    ```
    Access in loader/action:
    ```ts
    params.postId
    ```

  - **Catch-all Route**:  
    Syntax: `$param+`  
    Purpose: Match multiple path segments.  
    Example:
    ```
    app/routes/docs.$slug+.tsx
    ```

  ### 3.2 Route Naming Conventions
  - Use **lowercase** with dots for nested paths:  
    `dashboard.settings.profile` → `/dashboard/settings/profile`
  - Use `_` prefix for **resource routes** that are not directly accessible via URL.

  ### 3.3 Data Loading and Actions
  - Every route can export:
    ```ts
    export const loader: LoaderFunction = async ({ params, request }) => {
      // fetch data here
      return json({ ... });
    };

    export const action: ActionFunction = async ({ request }) => {
      // handle form submission or mutation
    };
    ```
  - Loader is **SSR** only — runs on the server before rendering.
  - Action is for **mutations** — triggered by Remix `<Form>` or `fetcher`.

  ### 3.4 Route Error Boundaries
  - Each route can define:
    ```ts
    export function ErrorBoundary({ error }: { error: Error }) {
      return <div className="text-red-500">Error: {error.message}</div>;
    }
    ```

- `app/components/`: reusable components.
- `app/lib/`: helpers, utilities, config.
- `app/services/`: API or database interaction logic.

## 4. Coding Guidelines
- Always use async/await, avoid promise chaining.
- Validate data on both client and server (use `zod`).
- Keep **UI** and **logic** strictly separated.
- When building forms:
  - Use Remix `<Form>` component.
  - Validate with `zod` before submitting.
  - Display clear error messages.

## 5. API and Data Fetching
- Use Remix loader & action for SSR data and mutations.
- Always handle errors in loader/action and return a consistent structure:
  ```ts
  { success: boolean, data?: any, error?: string }
