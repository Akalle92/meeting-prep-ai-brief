
import { supabase } from "@/integrations/supabase/client";
import { Meeting, MeetingBrief, MeetingParticipant } from "@/types";

export type { Meeting, MeetingBrief, MeetingParticipant };

export const connectCalendar = async (provider: "google" | "outlook") => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider === "outlook" ? "microsoft" : provider,
      options: {
        scopes: provider === "google" 
          ? ['https://www.googleapis.com/auth/calendar.readonly'] 
          : ['calendars.read'],
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error connecting calendar:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error connecting calendar:", error.message);
    return { success: false, error: error.message };
  }
};

export const fetchMeetings = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not found");
      return { success: false, error: "User not found" };
    }

    const userId = user.id;

    // Use a type assertion to bypass the type checking issue
    const { data, error } = await supabase
      .from('meetings' as any)
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching meetings:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching meetings:", error.message);
    return { success: false, error: error.message };
  }
};

// Adding these placeholder functions for the interface to match
export const getMeetingParticipants = async (meetingId: string, provider: string) => {
  // Mock implementation until real backend is connected
  return [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'organizer' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'attendee' },
  ] as MeetingParticipant[];
};

export const generateBrief = async (meetingId: string, provider: string) => {
  // Mock implementation until real backend is connected
  return {
    summary: 'This is a meeting summary that would be generated from the meeting context and related emails.',
    recentEmails: [{
      id: '1',
      subject: 'Meeting Agenda',
      date: new Date(),
      excerpt: 'Here is the agenda for our upcoming meeting...'
    }],
    actionItems: ['Review project timeline', 'Prepare budget report', 'Schedule follow-up'],
    talkingPoints: ['Project status update', 'Resource allocation', 'Next steps']
  } as MeetingBrief;
};
