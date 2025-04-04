
import { Button } from "@/components/ui/button";
import { Calendar, CalendarCheck, CalendarClock, CalendarX, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCalendarContext } from "@/providers/CalendarProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";

export type CalendarProvider = "google" | "microsoft" | "apple";

interface CalendarIntegrationProps {
  onSelect?: (provider: CalendarProvider) => void;
  className?: string;
}

export function CalendarIntegration({ onSelect, className }: CalendarIntegrationProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { connectCalendar, connectedProviders } = useCalendarContext();

  const handleConnectCalendar = async (provider: CalendarProvider) => {
    if (provider === "apple") {
      // Apple calendar integration is not supported through edge functions
      toast({
        title: "Apple Calendar",
        description: "Apple Calendar integration is coming soon.",
      });
      return;
    }
    
    // Map "microsoft" to "outlook" for our API
    const apiProvider = provider === "microsoft" ? "outlook" : provider;
    
    try {
      await connectCalendar(apiProvider as "google" | "outlook");
      
      if (onSelect) {
        onSelect(provider);
      }
      
      setOpen(false);
    } catch (error) {
      console.error("Calendar connection error:", error);
      toast({
        title: "Connection Failed",
        description: `Could not connect to ${provider} Calendar. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const isConnected = (provider: CalendarProvider): boolean => {
    // Map Microsoft to outlook for checking connection status
    if (provider === "microsoft") {
      return connectedProviders.includes("outlook");
    }
    return connectedProviders.includes(provider as "google");
  };

  const CalendarOptions = () => (
    <div className="grid gap-4 py-4">
      <Button
        onClick={() => handleConnectCalendar("google")}
        variant={isConnected("google") ? "outline" : "outline"}
        className={`justify-start h-auto py-4 ${isConnected("google") ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""}`}
      >
        <div className="flex items-center gap-3">
          <div className={`${isConnected("google") ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"} p-2 rounded-md`}>
            <Calendar className={`h-5 w-5 ${isConnected("google") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`} />
          </div>
          <div className="text-left">
            <div className="flex items-center">
              <h3 className="font-medium">Google Calendar</h3>
              {isConnected("google") && (
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-500">
                  Connected
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {isConnected("google") 
                ? "Your Google Calendar is connected" 
                : "Connect your Google Calendar account"}
            </p>
          </div>
        </div>
      </Button>
      
      <Button
        onClick={() => handleConnectCalendar("microsoft")}
        variant={isConnected("microsoft") ? "outline" : "outline"}
        className={`justify-start h-auto py-4 ${isConnected("microsoft") ? "border-green-500 bg-green-50 dark:bg-green-900/20" : ""}`}
      >
        <div className="flex items-center gap-3">
          <div className={`${isConnected("microsoft") ? "bg-green-100 dark:bg-green-900/30" : "bg-blue-100 dark:bg-blue-900/30"} p-2 rounded-md`}>
            <CalendarClock className={`h-5 w-5 ${isConnected("microsoft") ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`} />
          </div>
          <div className="text-left">
            <div className="flex items-center">
              <h3 className="font-medium">Microsoft Outlook</h3>
              {isConnected("microsoft") && (
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-500">
                  Connected
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {isConnected("microsoft") 
                ? "Your Outlook Calendar is connected" 
                : "Connect your Outlook Calendar account"}
            </p>
          </div>
        </div>
      </Button>
      
      <Button
        onClick={() => handleConnectCalendar("apple")}
        variant="outline"
        className="justify-start h-auto py-4 opacity-70"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
            <CalendarCheck className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Apple Calendar</h3>
            <p className="text-sm text-muted-foreground">Coming soon</p>
          </div>
        </div>
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <div className={className}>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto animate-fade-in">
              <Calendar className="h-4 w-4 mr-2" />
              {connectedProviders.length > 0 ? "Manage Calendars" : "Connect Calendar"}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Connect Calendar</DrawerTitle>
              <DrawerDescription>
                Connect your preferred calendar service to import and sync your meetings.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <CalendarOptions />
            </div>
            <DrawerFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className={className}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto animate-fade-in">
            <Calendar className="h-4 w-4 mr-2" />
            {connectedProviders.length > 0 ? "Manage Calendars" : "Connect Calendar"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Calendar</DialogTitle>
            <DialogDescription>
              Connect your preferred calendar service to import and sync your meetings.
            </DialogDescription>
          </DialogHeader>
          <CalendarOptions />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CalendarCard() {
  const { connectedProviders } = useCalendarContext();
  const hasConnectedCalendars = connectedProviders.length > 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Calendar Integration</CardTitle>
        <CardDescription>
          Connect your calendar to automatically import your meetings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/50">
          <div className="flex flex-col items-center text-center">
            {hasConnectedCalendars ? (
              <>
                <CalendarCheck className="h-10 w-10 text-primary mb-3" />
                <h3 className="font-medium text-lg">
                  {connectedProviders.length === 1 
                    ? `1 Calendar Connected` 
                    : `${connectedProviders.length} Calendars Connected`}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Your meetings are being imported and analyzed
                </p>
              </>
            ) : (
              <>
                <CalendarX className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-medium text-lg">No Calendar Connected</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Connect your calendar to import your meetings and receive briefings
                </p>
              </>
            )}
            <CalendarIntegration />
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Your calendar data will only be used to generate meeting briefs.
      </CardFooter>
    </Card>
  );
}
