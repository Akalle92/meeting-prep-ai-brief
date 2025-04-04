
import { useState } from "react";
import { Header } from "@/components/Header";
import { MeetingCard } from "@/components/MeetingCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarCheck, CalendarPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// Mock data for example
const MOCK_MEETINGS = [
  {
    id: "1",
    title: "Weekly Team Sync",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days in future
    location: "Conference Room A",
    attendeeCount: 5,
    isUpcoming: true,
  },
  {
    id: "2",
    title: "Product Demo with Client",
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days in future
    location: "Zoom Call",
    attendeeCount: 3,
    isUpcoming: true,
  },
  {
    id: "3",
    title: "Quarterly Planning",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in future
    location: "Main Boardroom",
    attendeeCount: 8,
    isUpcoming: true,
  },
  {
    id: "4",
    title: "Interview: Senior Developer",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days in past
    location: "HR Office",
    attendeeCount: 2,
    isUpcoming: false,
  },
  {
    id: "5",
    title: "Marketing Strategy Review",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days in past
    location: "Conference Room B",
    attendeeCount: 4,
    isUpcoming: false,
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  // Simulate no connected services when app is first launched
  const [hasConnectedServices, setHasConnectedServices] = useState(false);
  
  // Filter meetings based on search query
  const filteredMeetings = MOCK_MEETINGS.filter(meeting => 
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const upcomingMeetings = filteredMeetings.filter(m => m.isUpcoming);
  const pastMeetings = filteredMeetings.filter(m => !m.isUpcoming);
  
  const handleConnectCalendar = () => {
    // Simulate connecting a calendar service
    toast({
      title: "Service Connection",
      description: "This would connect to a calendar service in a real app.",
    });
    setHasConnectedServices(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">MeetingPrep Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Get AI-powered insights for your upcoming meetings
            </p>
          </div>
          
          <div className="w-full md:w-auto flex gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search meetings..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <CalendarPlus className="h-4 w-4 mr-2" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {!hasConnectedServices ? (
          <EmptyState
            title="Connect your calendar to get started"
            description="MeetingPrep AI needs access to your calendar to provide meeting insights and briefings."
            icon={<Calendar className="h-12 w-12 text-primary/50" />}
            actionLabel="Connect Calendar"
            onAction={handleConnectCalendar}
          />
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming ({upcomingMeetings.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center">
                <CalendarCheck className="h-4 w-4 mr-2" />
                Past Meetings ({pastMeetings.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-0">
              {upcomingMeetings.length === 0 ? (
                <EmptyState
                  title="No upcoming meetings"
                  description="You don't have any upcoming meetings. When you do, they'll appear here."
                  actionLabel="Refresh Calendar"
                  onAction={() => toast({
                    title: "Refreshing",
                    description: "Checking for new calendar events..."
                  })}
                />
              ) : (
                <div className="meeting-grid">
                  {upcomingMeetings.map((meeting) => (
                    <MeetingCard key={meeting.id} {...meeting} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="mt-0">
              {pastMeetings.length === 0 ? (
                <EmptyState
                  title="No past meetings"
                  description="Your past meetings will appear here."
                />
              ) : (
                <div className="meeting-grid">
                  {pastMeetings.map((meeting) => (
                    <MeetingCard key={meeting.id} {...meeting} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;
