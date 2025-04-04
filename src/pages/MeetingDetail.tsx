import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Download, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AttendeeProfile } from "@/components/AttendeeProfile";
import { MeetingBrief } from "@/components/MeetingBrief";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/PageLayout";
import { CalendarIntegration } from "@/components/CalendarIntegration";

// Mock data
const MEETINGS = {
  "1": {
    id: "1",
    title: "Weekly Team Sync",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    location: "Conference Room A",
    description: "Weekly sync to discuss project progress and roadblocks.",
    attendees: [
      {
        id: "a1",
        name: "Alex Johnson",
        email: "alex@example.com",
        role: "Product Manager",
        company: "Acme Inc",
        avatarUrl: "",
        recentEmails: 5,
        linkedInUrl: "https://linkedin.com/in/example",
      },
      {
        id: "a2",
        name: "Sam Williams",
        email: "sam@example.com",
        role: "Senior Developer",
        company: "Acme Inc",
        avatarUrl: "",
        recentEmails: 3,
      },
      {
        id: "a3",
        name: "Taylor Chen",
        email: "taylor@example.com",
        role: "UI/UX Designer",
        company: "Acme Inc",
        avatarUrl: "",
        recentEmails: 2,
      },
    ],
    brief: {
      summary: "This is the weekly team sync meeting to discuss project progress, roadblocks, and next steps. According to recent communications, the team is working on launching feature X, with some delays in the API integration. The deadline is approaching, and there are a few outstanding issues to address.",
      recentEmails: [
        {
          id: "e1",
          subject: "Re: Timeline for feature X",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          excerpt: "I think we need to extend the timeline by one week due to the API integration issues we've been facing...",
        },
        {
          id: "e2",
          subject: "Updated wireframes for dashboard",
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          excerpt: "I've attached the updated wireframes for the dashboard. Please review and provide feedback...",
        }
      ],
      actionItems: [
        "Follow up on API integration issues with the backend team",
        "Review updated wireframes and provide feedback",
        "Update project timeline in project management tool"
      ],
      talkingPoints: [
        "Progress on feature X development",
        "API integration challenges",
        "Timeline adjustment needs",
        "Resource allocation for next sprint"
      ]
    }
  },
  "2": {
    id: "2",
    title: "Product Demo with Client",
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    location: "Zoom Call",
    description: "Product demo with potential client ABC Corp.",
    attendees: [
      {
        id: "a4",
        name: "Jordan Smith",
        email: "jordan@abccorp.com",
        role: "CTO",
        company: "ABC Corp",
        avatarUrl: "",
        recentEmails: 1,
        linkedInUrl: "https://linkedin.com/in/example",
      },
      {
        id: "a5",
        name: "Morgan Lee",
        email: "morgan@abccorp.com",
        role: "Product Owner",
        company: "ABC Corp",
        avatarUrl: "",
        recentEmails: 3,
      }
    ],
    brief: {
      summary: "This is a product demo meeting with ABC Corp, a potential client interested in our enterprise solution. Their team has expressed interest in our analytics features and API capabilities. They have concerns about security compliance and integration with their existing systems.",
      recentEmails: [
        {
          id: "e3",
          subject: "Questions before the demo",
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          excerpt: "We'd like to see specific examples of how your analytics dashboard would work with our data structure...",
        }
      ],
      actionItems: [
        "Prepare demo environment with ABC Corp example data",
        "Review security compliance documentation",
        "Prepare integration examples for their tech stack"
      ],
      talkingPoints: [
        "Introduction to key analytics features",
        "API documentation and capabilities",
        "Security and compliance standards",
        "Integration options with existing systems",
        "Pricing and timeline for implementation"
      ]
    }
  }
};

const MeetingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const meeting = MEETINGS[id as keyof typeof MEETINGS];
  
  if (!meeting) {
    return (
      <PageLayout title="Meeting not found">
        <div className="text-center">
          <p className="mt-2 text-muted-foreground">
            The meeting you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/" className="group">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{meeting.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {format(meeting.date, "EEEE, MMMM do, yyyy")}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {format(meeting.date, "h:mm a")}
              </div>
              {meeting.location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {meeting.location}
                </div>
              )}
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                {meeting.attendees.length} attendees
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <CalendarIntegration className="flex-1 md:flex-none" />
            <Button className="flex-1 md:flex-none">
              <Download className="h-4 w-4 mr-2" />
              Export Brief
            </Button>
          </div>
        </div>
        
        {meeting.description && (
          <p className="mt-4 text-muted-foreground">{meeting.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <MeetingBrief 
            title={meeting.title}
            summary={meeting.brief.summary}
            recentEmails={meeting.brief.recentEmails}
            actionItems={meeting.brief.actionItems}
            talkingPoints={meeting.brief.talkingPoints}
          />
        </div>
        
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div>
            <h2 className="text-xl font-semibold mb-3">Attendees</h2>
            <div className="space-y-4">
              {meeting.attendees.map((attendee, index) => (
                <div key={attendee.id} className="animate-fade-in" style={{ animationDelay: `${300 + (index * 100)}ms` }}>
                  <AttendeeProfile
                    name={attendee.name}
                    email={attendee.email}
                    role={attendee.role}
                    company={attendee.company}
                    avatarUrl={attendee.avatarUrl}
                    recentEmails={attendee.recentEmails}
                    linkedInUrl={attendee.linkedInUrl}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MeetingDetail;
