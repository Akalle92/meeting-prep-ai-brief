
import { ReactNode } from "react";
import { Header } from "@/components/Header";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function PageLayout({ children, title, description, className }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <Header />
      <main className={`flex-1 container py-8 animate-fade-in ${className || ""}`}>
        {(title || description) && (
          <div className="mb-8">
            {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
            {description && <p className="text-muted-foreground mt-2">{description}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
