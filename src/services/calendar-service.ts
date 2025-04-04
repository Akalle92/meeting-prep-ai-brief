import { supabase } from "@/integrations/supabase/client";

export const connectCalendar = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
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
