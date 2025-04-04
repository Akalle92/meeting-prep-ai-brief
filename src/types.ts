
export interface Meeting {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  location?: string;
  attendeeCount: number;
  isUpcoming: boolean;
  provider?: "google" | "outlook";
  description?: string;
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

export interface MeetingParticipant {
  id: string;
  name?: string;
  email: string;
  role?: "attendee" | "organizer" | "optional";
}
