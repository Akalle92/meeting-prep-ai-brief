
import { Link } from "react-router-dom";
import { Bell, Calendar, Cog, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const isMobile = useIsMobile();

  const NavItems = () => (
    <>
      <Link to="/" className="flex items-center space-x-2">
        <span className="font-bold text-xl">MeetingPrep AI</span>
      </Link>

      <div className="flex items-center space-x-4">
        <Link to="/settings">
          <Button variant="ghost" size="icon">
            <Cog className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </Link>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </>
  );

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {isMobile ? (
          <>
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">MeetingPrep AI</span>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <Link to="/" className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                    <Calendar className="h-5 w-5" />
                    <span>Meetings</span>
                  </Link>
                  <Link to="/settings" className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                    <Cog className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <NavItems />
        )}
      </div>
    </header>
  );
}
