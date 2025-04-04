import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Meeting } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import {
  getMeetings as getMeetingsService,
  connectCalendar as connectCalendarService,
} from "@/services/calendar-service";
import { useAuth } from "./AuthProvider";

interface CalendarContextType {
  meetings: Meeting[];
  fetchMeetings: () => Promise<void>;
  connectCalendar: () => Promise<void>;
  isCalendarConnected: boolean;
  isLoading: boolean;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isCalendarConnected, setCalendarConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchMeetings = useCallback(async () => {
    if (!user) {
      console.warn("User not logged in, cannot fetch meetings.");
      return;
    }

    setIsLoading(true);
    try {
      const fetchedMeetings = await getMeetingsService();
      setMeetings(fetchedMeetings);
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
      toast({
        title: "Failed to Fetch Meetings",
        description: "There was an error fetching your meetings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);

  const connectCalendar = async () => {
    setIsLoading(true);
    try {
      const connectResult = await connectCalendarService();
      if (connectResult !== undefined && connectResult !== null) {
        toast({
          title: "Calendar Connected",
          description: "Your calendar has been successfully connected.",
        });
        setCalendarConnected(true);
        fetchMeetings();
      }
    } catch (error) {
      console.error("Failed to connect calendar:", error);
      toast({
        title: "Failed to Connect Calendar",
        description: "There was an error connecting your calendar.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMeetings();
    }
  }, [user, fetchMeetings]);

  const value: CalendarContextType = {
    meetings,
    fetchMeetings,
    connectCalendar,
    isCalendarConnected,
    isLoading,
  };

  return (
    <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
