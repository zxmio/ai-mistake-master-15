import { Header } from "./Header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background mesh gradient */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main className="container py-8 md:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
