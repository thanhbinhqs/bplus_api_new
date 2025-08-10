import type { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  user?: {
    fullName: string;
    username: string;
    role: string;
  } | null;
  className?: string;
}

export function Layout({ children, user, className = "" }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header user={user} />
      <main className={`flex-1 overflow-auto ${className}`}>
        {children}
      </main>
    </div>
  );
}

// Layout variant cho các trang không cần margin/padding
export function LayoutFull({ children, user }: LayoutProps) {
  return (
    <Layout user={user} className="h-full">
      {children}
    </Layout>
  );
}

// Layout variant cho các trang cần container và padding
export function LayoutContainer({ children, user }: LayoutProps) {
  return (
    <Layout user={user} className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto h-full">
        {children}
      </div>
    </Layout>
  );
}

// Layout variant cho trang auth (login, register)
export function LayoutAuth({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {children}
    </div>
  );
}
