
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
  fetchMeetings,
  connectCalendar,
  generateBrief,
  getMeetingParticipants
} from "@/services/calendar-service";
import { useAuth } from "./AuthProvider";

interface CalendarContextType {
  meetings: Meeting[];
  upcomingMeetings: Meeting[];
  fetchMeetings: () => Promise<void>;
  refreshMeetings: () => Promise<void>;
  connectCalendar: (provider: "google" | "outlook") => Promise<void>;
  generateBrief: (meetingId: string, provider: string) => Promise<any>;
  getMeetingParticipants: (meetingId: string, provider: string) => Promise<any>;
  isCalendarConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connectedProviders: ("google" | "outlook")[];
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isCalendarConnected, setCalendarConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedProviders, setConnectedProviders] = useState<("google" | "outlook")[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchMeetingsData = useCallback(async () => {
    if (!user) {
      console.warn("User not logged in, cannot fetch meetings.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchMeetings();
      if (response.success && response.data) {
        setMeetings(response.data as Meeting[]);
      } else {
        setError(response.error || "Unknown error fetching meetings");
      }
    } catch (error: any) {
      console.error("Failed to fetch meetings:", error);
      setError(error.message || "Failed to fetch meetings");
      toast({
        title: "Failed to Fetch Meetings",
        description: "There was an error fetching your meetings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user]);

  const refreshMeetings = async () => {
    await fetchMeetingsData();
  };

  const connectCalendarHandler = async (provider: "google" | "outlook") => {
    setIsLoading(true);
    try {
      const result = await connectCalendar(provider);
      if (result.success) {
        toast({
          title: "Calendar Connected",
          description: `Your ${provider} calendar has been successfully connected.`,
        });
        setCalendarConnected(true);
        setConnectedProviders(prev => 
          prev.includes(provider) ? prev : [...prev, provider]
        );
        await fetchMeetingsData();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Failed to connect calendar:", error);
      toast({
        title: "Failed to Connect Calendar",
        description: `There was an error connecting your ${provider} calendar.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMeetingsData();
    }
  }, [user, fetchMeetingsData]);

  // Calculate upcoming meetings
  const upcomingMeetings = meetings.filter(meeting => 
    meeting.isUpcoming || new Date(meeting.date) > new Date()
  );

  const value: CalendarContextType = {
    meetings,
    upcomingMeetings,
    fetchMeetings: fetchMeetingsData,
    refreshMeetings,
    connectCalendar: connectCalendarHandler,
    generateBrief,
    getMeetingParticipants,
    isCalendarConnected,
    isLoading,
    error,
    connectedProviders,
  };

  return (
    <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
  );
}

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendarContext must be used within a CalendarProvider");
  }
  return context;
}
