
import { Link } from "react-router-dom";
import { Bell, Calendar, Cog, Menu, Calendar as CalendarIcon, PenLine, LogOut, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/providers/AuthProvider";

export function Header() {
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  const NavItems = () => (
    <>
      <Link to="/" className="flex items-center space-x-2">
        <CalendarIcon className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">MeetingPrep AI</span>
      </Link>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        <Link to="/settings">
          <Button variant="ghost" size="icon" className="transition-colors hover:bg-primary/10">
            <Cog className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </Link>
        
        {user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative transition-colors hover:bg-primary/10">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="px-4 py-3 border-b">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <p className="text-sm text-muted-foreground">You have 3 unread notifications</p>
                </div>
                <div className="py-2">
                  <DropdownMenuItem className="cursor-pointer flex flex-col items-start py-3 px-4 space-y-1">
                    <div className="flex items-center w-full">
                      <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">Weekly Team Sync</span>
                      <span className="ml-auto text-xs text-muted-foreground">2h ago</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Brief is ready for your review</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex flex-col items-start py-3 px-4 space-y-1">
                    <div className="flex items-center w-full">
                      <PenLine className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">Meeting Notes</span>
                      <span className="ml-auto text-xs text-muted-foreground">1d ago</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Project kickoff notes have been generated</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 transition-transform hover:scale-105 cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>{user.email?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Cog className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link to="/auth">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          </Button>
        )}
      </div>
    </>
  );

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="transition-colors hover:bg-primary/10">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col space-y-4 mt-8">
          <Link to="/" className="flex items-center space-x-2 p-3 rounded-md hover:bg-accent transition-colors">
            <Calendar className="h-5 w-5" />
            <span>Meetings</span>
          </Link>
          <Link to="/settings" className="flex items-center space-x-2 p-3 rounded-md hover:bg-accent transition-colors">
            <Cog className="h-5 w-5" />
            <span>Settings</span>
          </Link>
          {user ? (
            <button
              onClick={signOut}
              className="flex items-center space-x-2 p-3 rounded-md hover:bg-accent transition-colors text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign out</span>
            </button>
          ) : (
            <Link to="/auth" className="flex items-center space-x-2 p-3 rounded-md hover:bg-accent transition-colors">
              <LogIn className="h-5 w-5" />
              <span>Sign in</span>
            </Link>
          )}
          <div className="pt-4 mt-4 border-t">
            {user ? (
              <div className="flex items-center p-3">
                <Avatar className="h-9 w-9 mr-3">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>{user.email?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Signed in</p>
                </div>
              </div>
            ) : (
              <div className="p-3 text-sm text-muted-foreground">
                Sign in to access all features
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {isMobile ? (
          <>
            <Link to="/" className="flex items-center space-x-2">
              <CalendarIcon className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">MeetingPrep AI</span>
            </Link>
            <MobileNav />
          </>
        ) : (
          <NavItems />
        )}
      </div>
    </header>
  );
}
