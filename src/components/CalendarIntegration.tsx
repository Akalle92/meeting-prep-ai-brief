
import { Button } from "@/components/ui/button";
import { Calendar, CalendarCheck, CalendarClock, CalendarX } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
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

export type CalendarProvider = "google" | "microsoft" | "apple";

interface CalendarIntegrationProps {
  onSelect?: (provider: CalendarProvider) => void;
  className?: string;
}

export function CalendarIntegration({ onSelect, className }: CalendarIntegrationProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleConnectCalendar = (provider: CalendarProvider) => {
    // In a real implementation, this would handle OAuth flow
    toast({
      title: "Calendar Connection",
      description: `Connecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar...`,
    });
    
    if (onSelect) {
      onSelect(provider);
    }
    
    setOpen(false);

    // Simulate successful connection
    setTimeout(() => {
      toast({
        title: "Calendar Connected",
        description: `Successfully connected to ${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar!`,
      });
    }, 1500);
  };

  const CalendarOptions = () => (
    <div className="grid gap-4 py-4">
      <Button
        onClick={() => handleConnectCalendar("google")}
        variant="outline"
        className="justify-start h-auto py-4"
      >
        <div className="flex items-center gap-3">
          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-md">
            <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Google Calendar</h3>
            <p className="text-sm text-muted-foreground">Connect your Google Calendar account</p>
          </div>
        </div>
      </Button>
      
      <Button
        onClick={() => handleConnectCalendar("microsoft")}
        variant="outline"
        className="justify-start h-auto py-4"
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
            <CalendarClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Microsoft Outlook</h3>
            <p className="text-sm text-muted-foreground">Connect your Outlook Calendar account</p>
          </div>
        </div>
      </Button>
      
      <Button
        onClick={() => handleConnectCalendar("apple")}
        variant="outline"
        className="justify-start h-auto py-4"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
            <CalendarCheck className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Apple Calendar</h3>
            <p className="text-sm text-muted-foreground">Connect your iCloud Calendar account</p>
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
              Connect Calendar
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
                Cancel
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
            Connect Calendar
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
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function CalendarCard() {
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
            <CalendarX className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="font-medium text-lg">No Calendar Connected</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Connect your calendar to import your meetings and receive briefings
            </p>
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
