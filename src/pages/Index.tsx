
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { MeetingCard } from "@/components/MeetingCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarCheck, CalendarPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CalendarCard } from "@/components/CalendarIntegration";
import { useCalendarContext } from "@/providers/CalendarProvider";
import { LoadingState } from "@/components/LoadingState";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { 
    upcomingMeetings, 
    isLoading, 
    error, 
    refreshMeetings, 
    connectedProviders
  } = useCalendarContext();
  
  // Filter meetings based on search query
  const filteredMeetings = upcomingMeetings.filter(meeting => 
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const upcomingMeetingsList = filteredMeetings.filter(m => m.isUpcoming);
  const pastMeetingsList = filteredMeetings.filter(m => !m.isUpcoming);
  
  // Refresh meetings data when the component mounts
  useEffect(() => {
    if (connectedProviders.length > 0) {
      refreshMeetings();
    }
  }, [connectedProviders, refreshMeetings]);

  const handleRefresh = () => {
    refreshMeetings();
    toast({
      title: "Refreshing Meetings",
      description: "Fetching the latest meetings from your calendars.",
    });
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
            <Button onClick={handleRefresh} disabled={isLoading || connectedProviders.length === 0}>
              <CalendarPlus className="h-4 w-4 mr-2" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {connectedProviders.length === 0 ? (
          <EmptyState
            title="Connect your calendar to get started"
            description="MeetingPrep AI needs access to your calendar to provide meeting insights and briefings."
            icon={<Calendar className="h-12 w-12 text-primary/50" />}
            actionComponent={<CalendarCard />}
          />
        ) : isLoading ? (
          <LoadingState message="Loading your meetings..." />
        ) : error ? (
          <EmptyState
            title="Error loading meetings"
            description="There was a problem loading your meetings. Please try again."
            icon={<Calendar className="h-12 w-12 text-destructive/50" />}
            actionLabel="Try Again"
            onAction={handleRefresh}
          />
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming ({upcomingMeetingsList.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center">
                <CalendarCheck className="h-4 w-4 mr-2" />
                Past Meetings ({pastMeetingsList.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-0">
              {upcomingMeetingsList.length === 0 ? (
                <EmptyState
                  title="No upcoming meetings"
                  description="You don't have any upcoming meetings. When you do, they'll appear here."
                  actionLabel="Refresh Calendar"
                  onAction={handleRefresh}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingMeetingsList.map((meeting) => (
                    <MeetingCard key={meeting.id} {...meeting} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="mt-0">
              {pastMeetingsList.length === 0 ? (
                <EmptyState
                  title="No past meetings"
                  description="Your past meetings will appear here."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pastMeetingsList.map((meeting) => (
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
