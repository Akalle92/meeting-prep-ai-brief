import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Types for meeting data and participants
export interface MeetingParticipant {
  id: string;
  name: string;
  email: string;
  responseStatus?: 'accepted' | 'declined' | 'tentative' | 'needsAction';
  role?: 'organizer' | 'attendee';
  created_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  location?: string;
  description?: string;
  attendeeCount: number;
  isUpcoming: boolean;
  provider: 'google' | 'outlook';
  participants?: MeetingParticipant[];
}

export interface MeetingBrief {
  summary: string;
  recentEmails?: {
    id: string;
    subject: string;
    date: Date;
    excerpt: string;
  }[];
  actionItems?: string[];
  talkingPoints?: string[];
}

// Define the type for the user_calendar_connections table
interface UserCalendarConnection {
  id: string;
  user_id: string;
  provider: 'google' | 'outlook';
  token: string;
  refresh_token: string;
  created_at: string;
}

// Placeholder types for Supabase function responses
// TODO: Replace these with actual types based on function implementation or generated types
interface UpcomingMeetingResponseItem {
  id: string;
  title: string;
  date: string; // Assuming date comes as string initially
  endDate?: string;
  location?: string;
  description?: string;
  attendeeCount: number;
  isUpcoming: boolean;
  participants?: any[]; // Keep participants flexible for now
  // Add other properties returned by the function
}

interface ParticipantResponseItem extends MeetingParticipant {
  // Add/adjust properties based on function response
}

interface EmailItem {
  id: string;
  subject: string;
  date: string; // Assuming date comes as string initially
  excerpt: string;
}

interface BriefResponse {
  summary: string;
  recentEmails?: EmailItem[];
  actionItems?: string[];
  talkingPoints?: string[];
  // Add other properties returned by the function
}

// Calendar service
export class CalendarService {
  private static instance: CalendarService;
  
  // Use singleton pattern for the service
  public static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  // Get user's connected calendar providers
  public async getConnectedProviders(): Promise<('google' | 'outlook')[]> {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        return [];
      }

      // Removed 'as any' - rely on Supabase type inference or generated types
      // Ensure 'user_calendar_connections' table and 'provider', 'user_id' columns exist
      const { data, error } = await supabase
        .from('user_calendar_connections')
        .select('provider')
        .eq('user_id', user.data.user.id);
      
      if (error) throw error;

      // Type assertion assumes 'provider' is correctly fetched
      return (data || []).map(connection => connection.provider as 'google' | 'outlook');
    } catch (error) {
      console.error("Error fetching connected providers:", error);
      return [];
    }
  }

  // Fetch upcoming meetings from all connected providers
  public async fetchUpcomingMeetings(): Promise<Meeting[]> {
    try {
      const providers = await this.getConnectedProviders();
      let allMeetings: Meeting[] = [];
      
      // Fetch Google Calendar meetings if connected
      if (providers.includes('google')) {
        const { data: googleMeetings, error } = await supabase.functions.invoke('fetch-upcoming-meetings');
        if (error) throw error;
        
        if (googleMeetings) {
          allMeetings = [
            ...allMeetings,
            // Use placeholder type for function response item
            ...googleMeetings.map((meeting: UpcomingMeetingResponseItem) => ({
              ...meeting,
              date: new Date(meeting.date),
              endDate: meeting.endDate ? new Date(meeting.endDate) : undefined,
              provider: 'google' as const
            }))
          ];
        }
      }
      
      // Fetch Outlook Calendar meetings if connected
      if (providers.includes('outlook')) {
        const { data: outlookMeetings, error } = await supabase.functions.invoke('fetch-outlook-meetings');
        if (error) throw error;
        
        if (outlookMeetings) {
          allMeetings = [
            ...allMeetings,
            // Use placeholder type for function response item
            ...outlookMeetings.map((meeting: UpcomingMeetingResponseItem) => ({
              ...meeting,
              date: new Date(meeting.date),
              endDate: meeting.endDate ? new Date(meeting.endDate) : undefined,
              provider: 'outlook' as const
            }))
          ];
        }
      }
      
      // Sort meetings by date
      return allMeetings.sort((a, b) => a.date.getTime() - b.date.getTime());
    } catch (error) {
      console.error("Error fetching upcoming meetings:", error);
      throw error;
    }
  }

  // Get meeting participants for a specific meeting
  public async getMeetingParticipants(meetingId: string, provider: 'google' | 'outlook'): Promise<MeetingParticipant[]> {
    try {
      const functionName = provider === 'google' ? 'get-meeting-participants' : 'get-outlook-participants';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { meetingId }
      });
      
      if (error) throw error;
      // Use placeholder type for function response item
      return (data as ParticipantResponseItem[]) || [];
    } catch (error) {
      console.error(`Error fetching participants for meeting ${meetingId}:`, error);
      throw error;
    }
  }

  // Generate meeting brief for a specific meeting
  public async generateMeetingBrief(meetingId: string, provider: 'google' | 'outlook'): Promise<MeetingBrief> {
    try {
      const functionName = provider === 'google' ? 'generate-meeting-brief' : 'generate-outlook-brief';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { meetingId }
      });
      
      if (error) throw error;

      // Use placeholder type for function response
      const rawBriefData = data as BriefResponse | null;

      // If no data, return null or handle appropriately
      if (!rawBriefData) {
        // Decide whether to return null, an empty brief, or throw
        // Returning null for now, adjust as needed.
        return null; 
      }

      // Construct the final MeetingBrief object with correct types
      const finalBrief: MeetingBrief = {
        ...rawBriefData,
        recentEmails: rawBriefData.recentEmails?.map((email: EmailItem) => ({
          ...email,
          date: new Date(email.date) // Ensure this matches MeetingBrief['recentEmails'][number]['date'] type (Date)
        })),
        // Ensure other fields match MeetingBrief type
      };

      return finalBrief; // Return the correctly typed object
    } catch (error) {
      console.error(`Error generating brief for meeting ${meetingId}:`, error);
      throw error;
    }
  }

  // Authenticate with a calendar provider
  // Changed return type to Promise<void>
  public async authenticateProvider(provider: 'google' | 'outlook'): Promise<void> {
    try {
      const functionName = provider === 'google' ? 'google-auth-url' : 'outlook-auth-url';
      
      const { data, error } = await supabase.functions.invoke(functionName);
      
      if (error) throw error;
      
      // Open the authentication URL in a new window
      window.open(data.url, '_blank', 'width=600,height=600');

      // The actual auth confirmation will happen when the OAuth redirect occurs
      // and the user returns to the app
      // Removed 'return true;'
    } catch (error) {
      console.error(`Error initiating ${provider} authentication:`, error);
      // Re-throw error so calling code (e.g., provider) can handle it
      throw error;
    }
  }
}

// Create React hook for calendar operations
export function useCalendar() {
  const calendarService = CalendarService.getInstance();
  const { toast } = useToast();

  // Function to handle errors with toast notifications
  const handleError = (error: any, message: string) => {
    console.error(message, error);
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  return {
    // Get all connected providers
    getConnectedProviders: async () => {
      try {
        return await calendarService.getConnectedProviders();
      } catch (error) {
        handleError(error, "Failed to get connected calendar providers");
        return [];
      }
    },

    // Fetch upcoming meetings
    fetchUpcomingMeetings: async () => {
      try {
        return await calendarService.fetchUpcomingMeetings();
      } catch (error) {
        handleError(error, "Failed to fetch upcoming meetings");
        return [];
      }
    },

    // Get meeting participants
    getMeetingParticipants: async (meetingId: string, provider: 'google' | 'outlook') => {
      try {
        return await calendarService.getMeetingParticipants(meetingId, provider);
      } catch (error) {
        handleError(error, "Failed to fetch meeting participants");
        return [];
      }
    },

    // Generate meeting brief
    generateMeetingBrief: async (meetingId: string, provider: 'google' | 'outlook') => {
      try {
        return await calendarService.generateMeetingBrief(meetingId, provider);
      } catch (error) {
        handleError(error, "Failed to generate meeting brief");
        return {
          summary: "Failed to generate meeting brief. Please try again later.",
          actionItems: [],
          talkingPoints: []
        };
      }
    },

    // Authenticate with a provider
    authenticateProvider: async (provider: 'google' | 'outlook') => {
      try {
        await calendarService.authenticateProvider(provider);
        toast({
          title: "Authentication Started",
          description: `Please complete the ${provider === 'google' ? 'Google' : 'Microsoft'} authentication in the popup window.`,
        });
      } catch (error) {
        handleError(error, `Failed to authenticate with ${provider}`);
      }
    }
  };
}
