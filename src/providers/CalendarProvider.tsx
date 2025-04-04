
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useCalendar, Meeting, MeetingBrief, MeetingParticipant } from "@/services/calendar-service";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingState } from "@/components/LoadingState";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

type CalendarProvider = 'google' | 'outlook';

interface CalendarContextType {
  isLoading: boolean;
  error: Error | null;
  connectedProviders: CalendarProvider[];
  upcomingMeetings: Meeting[];
  refreshMeetings: () => void;
  generateBrief: (meetingId: string, provider: CalendarProvider) => Promise<MeetingBrief>;
  getMeetingParticipants: (meetingId: string, provider: CalendarProvider) => Promise<MeetingParticipant[]>;
  connectCalendar: (provider: CalendarProvider) => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const calendar = useCalendar();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check for authenticated user
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        // Refresh connected providers when auth state changes
        if (session?.user) {
          queryClient.invalidateQueries({ queryKey: ['connectedProviders'] });
        }
      }
    );

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // Query for connected providers
  const {
    data: connectedProviders = [],
    isLoading: isLoadingProviders,
    error: providersError,
  } = useQuery({
    queryKey: ['connectedProviders'],
    queryFn: () => calendar.getConnectedProviders(),
    enabled: !!user, // Only run if user is authenticated
  });

  // Query for upcoming meetings
  const {
    data: upcomingMeetings = [],
    isLoading: isLoadingMeetings,
    error: meetingsError,
    refetch: refreshMeetings,
  } = useQuery({
    queryKey: ['upcomingMeetings'],
    queryFn: () => calendar.fetchUpcomingMeetings(),
    enabled: !!user && connectedProviders.length > 0, // Only run if user is authenticated and has connected providers
  });

  // Connect a calendar provider
  const connectCalendar = async (provider: CalendarProvider) => {
    try {
      const success = await calendar.authenticateProvider(provider);
      if (success) {
        // We'll rely on the OAuth redirect to update the state
        toast({
          title: "Calendar Connection Initiated",
          description: `Follow the instructions in the popup to connect your ${provider === 'google' ? 'Google' : 'Microsoft'} calendar.`,
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect ${provider} calendar. Please try again.`,
        variant: "destructive",
      });
    }
  };

  // Generate a meeting brief
  const generateBrief = async (meetingId: string, provider: CalendarProvider) => {
    return calendar.generateMeetingBrief(meetingId, provider);
  };

  // Get meeting participants
  const getMeetingParticipants = async (meetingId: string, provider: CalendarProvider) => {
    return calendar.getMeetingParticipants(meetingId, provider);
  };

  // Determine overall loading state and error
  const isLoading = isLoadingProviders || isLoadingMeetings;
  const error = providersError || meetingsError || null;

  return (
    <CalendarContext.Provider
      value={{
        isLoading,
        error: error as Error | null,
        connectedProviders,
        upcomingMeetings,
        refreshMeetings,
        generateBrief,
        getMeetingParticipants,
        connectCalendar,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendarContext must be used within a CalendarProvider");
  }
  return context;
}
