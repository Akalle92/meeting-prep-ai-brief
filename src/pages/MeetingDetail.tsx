import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, UserRound, MapPin, Clock } from "lucide-react";
import { MeetingBrief } from "@/components/MeetingBrief";
import { useCalendarContext } from "@/providers/CalendarProvider";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { LoadingState } from "@/components/LoadingState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Meeting, MeetingBrief as MeetingBriefType, MeetingParticipant } from "@/services/calendar-service";

const MeetingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const provider = searchParams.get("provider") as "google" | "outlook" || "google";
  const navigate = useNavigate();
  const { upcomingMeetings, generateBrief, getMeetingParticipants } = useCalendarContext();
  const { toast } = useToast();
  
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [brief, setBrief] = useState<MeetingBriefType | null>(null);
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBriefLoading, setIsBriefLoading] = useState(false);
  const [isParticipantsLoading, setIsParticipantsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const meetingDetails = upcomingMeetings.find(m => m.id === id);
    if (meetingDetails) {
      setMeeting(meetingDetails);
      setIsLoading(false);
    } else {
      setError("Meeting not found");
      setIsLoading(false);
    }
  }, [id, upcomingMeetings]);

  useEffect(() => {
    if (meeting && id) {
      setIsBriefLoading(true);
      generateBrief(id, provider)
        .then(data => {
          setBrief(data);
          setIsBriefLoading(false);
        })
        .catch(err => {
          console.error("Error loading brief:", err);
          setIsBriefLoading(false);
        });
      
      setIsParticipantsLoading(true);
      getMeetingParticipants(id, provider)
        .then(data => {
          setParticipants(data);
          setIsParticipantsLoading(false);
        })
        .catch(err => {
          console.error("Error loading participants:", err);
          setIsParticipantsLoading(false);
        });
    }
  }, [meeting, id, provider, generateBrief, getMeetingParticipants]);

  const handleRefreshBrief = () => {
    if (!id) return;
    
    setIsBriefLoading(true);
    toast({
      title: "Refreshing Brief",
      description: "Generating an updated brief for this meeting...",
    });
    
    generateBrief(id, provider)
      .then(data => {
        setBrief(data);
        setIsBriefLoading(false);
        toast({
          title: "Brief Updated",
          description: "Meeting brief has been refreshed with the latest information.",
        });
      })
      .catch(err => {
        console.error("Error refreshing brief:", err);
        setIsBriefLoading(false);
        toast({
          title: "Error",
          description: "Failed to refresh meeting brief. Please try again.",
          variant: "destructive",
        });
      });
  };

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState message="Loading meeting details..." />
      </PageLayout>
    );
  }

  if (error || !meeting) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-medium mb-2">Meeting Not Found</h2>
          <p className="text-muted-foreground mb-4">The meeting you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title={meeting.title}
      description={
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {format(meeting.date, "EEEE, MMMM do, yyyy · h:mm a")}
            {meeting.endDate && (
              <> - {format(meeting.endDate, "h:mm a")}</>
            )}
          </div>
          {meeting.location && (
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {meeting.location}
            </div>
          )}
          <div className="flex items-center mt-1">
            <Badge variant="outline" className="mr-2">
              {provider === "google" ? "Google Calendar" : "Outlook Calendar"}
            </Badge>
            {meeting.isUpcoming ? (
              <Badge variant="secondary">Upcoming</Badge>
            ) : (
              <Badge variant="outline">Past</Badge>
            )}
          </div>
        </div>
      }
    >
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium flex items-center">
                <UserRound className="h-5 w-5 mr-2 text-primary" />
                Participants
                <Badge className="ml-2">{participants.length}</Badge>
              </h3>
            </div>
            <div className="p-4">
              {isParticipantsLoading ? (
                <LoadingState message="Loading participants..." className="h-20" />
              ) : participants.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No participant data available</p>
              ) : (
                <div className="space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${participant.email}`} />
                        <AvatarFallback>
                          {participant.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{participant.name || "Unknown"}</div>
                        <div className="text-sm text-muted-foreground">{participant.email}</div>
                      </div>
                      {participant.role === "organizer" && (
                        <Badge variant="outline" className="ml-auto">Organizer</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Meeting Brief</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshBrief}
              disabled={isBriefLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isBriefLoading ? "animate-spin" : ""}`} />
              Refresh Brief
            </Button>
          </div>
          
          {isBriefLoading ? (
            <LoadingState message="Generating meeting brief..." />
          ) : brief ? (
            <MeetingBrief
              title={meeting.title}
              summary={brief.summary}
              recentEmails={brief.recentEmails}
              actionItems={brief.actionItems}
              talkingPoints={brief.talkingPoints}
            />
          ) : (
            <div className="border rounded-lg p-6 text-center">
              <p className="text-muted-foreground mb-4">No meeting brief is available.</p>
              <Button onClick={handleRefreshBrief}>Generate Brief</Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default MeetingDetail;
