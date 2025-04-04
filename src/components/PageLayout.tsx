
import { ReactNode, useEffect } from "react";
import { Header } from "@/components/Header";
import { useLocation } from "react-router-dom";

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: ReactNode; // Changed from string to ReactNode to accept JSX elements
  className?: string;
}

export function PageLayout({ children, title, description, className }: PageLayoutProps) {
  const location = useLocation();

  // Reset scroll position when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <Header />
      <main className={`flex-1 container py-6 md:py-8 px-4 md:px-6 animate-enter ${className || ""}`}>
        {(title || description) && (
          <div className="mb-6 md:mb-8">
            {title && <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-balance">{title}</h1>}
            {description && <div className="text-muted-foreground mt-2 max-w-3xl">{description}</div>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
