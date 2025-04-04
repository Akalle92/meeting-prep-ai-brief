
import { Link } from "react-router-dom";
import { 
  CalendarClock, 
  Clock, 
  MapPin, 
  Users,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface EnhancedMeetingCardProps {
  id: string;
  title: string;
  date: Date;
  location?: string;
  attendeeCount: number;
  isUpcoming: boolean;
  description?: string;
}

export function EnhancedMeetingCard({ 
  id, 
  title, 
  date, 
  location, 
  attendeeCount, 
  isUpcoming,
  description 
}: EnhancedMeetingCardProps) {
  return (
    <div className="group animate-fade-in">
      <Link to={`/meeting/${id}`}>
        <Card className="h-full transition-all duration-300 hover:shadow-md group-hover:border-primary/50 overflow-hidden">
          <CardHeader className="pb-2 relative">
            <div className="flex justify-between items-start">
              <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">{title}</CardTitle>
              {isUpcoming && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Badge variant="secondary" className="ml-2 shrink-0 cursor-help">
                      <CalendarClock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(date, { addSuffix: true })}
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Meeting scheduled</h4>
                      <p className="text-sm text-muted-foreground">
                        This meeting will take place {formatDistanceToNow(date, { addSuffix: true })} on{' '}
                        {format(date, "EEEE, MMMM do, yyyy")} at {format(date, "h:mm a")}
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>
            )}
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary/70" />
                <span>{format(date, "EEEE, MMMM do · h:mm a")}</span>
              </div>
              {location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                  <span className="truncate">{location}</span>
                </div>
              )}
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary/70" />
                <span>{attendeeCount} attendee{attendeeCount !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
              Brief {isUpcoming ? "Pending" : "Available"}
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
