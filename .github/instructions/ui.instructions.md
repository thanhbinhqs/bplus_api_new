---
applyTo: '**'
---
# AI UI Instructions – Remix Project

## 🎯 Objective
Provide guidelines for the AI Agent when developing the UI for the Remix project to ensure consistent use of the selected UI libraries, coding style, and responsive design rules.

---

## 1. Required UI Libraries
- **Tailwind CSS** → main styling, responsive layout.
- **shadcn/ui** → base UI components (Button, Card, Dialog, Tabs, Form...).
- **Lucide-react** → icons.
- **TanStack Table (React Table)** → data tables.
- **React Hot Toast** → toast notifications.
- **Radix UI** → advanced custom UI support.

---

## 2. Usage Rules
1. **Styling**  
   - Use only Tailwind CSS for custom styling; avoid plain CSS unless for specific overrides.  
   - Arrange Tailwind classes in order: layout → spacing → color → typography → effects.

2. **Components**  
   - Use shadcn/ui as the base for components.  
   - Do not create new components if an existing one is available in the library.  
   - All buttons, forms, modals, dialogs must be based on shadcn/ui + Radix UI.

3. **Table**  
   - All data tables must use TanStack Table.  
   - Pagination, sorting, and filtering must be handled through TanStack Table APIs.

4. **Notification**  
   - Use React Hot Toast.  
   - Toast style must be consistent: `rounded-lg`, light shadow, background color based on state.

5. **Icons**  
   - Use Lucide-react.  
   - Default icon size: `size={20}`, color inherited from text color.

---

## 3. Responsive Design
- Standard breakpoints:
  - `sm` ≥ 640px
  - `md` ≥ 768px
  - `lg` ≥ 1024px
  - `xl` ≥ 1280px
- Always follow mobile-first approach with Tailwind classes.

---

## 4. Code Style
- Use functional components with React hooks.
- Props must be typed with TypeScript.
- Standard component structure:
  ```tsx
  import { Button } from "@/components/ui/button";
  import { LucideIconName } from "lucide-react";
  
  interface MyComponentProps {
    title: string;
    onClick: () => void;
  }

  export function MyComponent({ title, onClick }: MyComponentProps) {
    return (
      <Button onClick={onClick}>
        <LucideIconName className="mr-2 h-4 w-4" />
        {title}
      </Button>
    );
  }
