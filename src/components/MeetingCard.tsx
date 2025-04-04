
import { Link } from "react-router-dom";
import { 
  CalendarClock, 
  Clock, 
  MapPin, 
  Users,
  MailOpen,
  Mail
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { Meeting } from "@/services/calendar-service";

interface MeetingCardProps extends Meeting {
  briefAvailable?: boolean;
}

export function MeetingCard({ 
  id, 
  title, 
  date, 
  location, 
  attendeeCount, 
  isUpcoming,
  provider,
  briefAvailable = false
}: MeetingCardProps) {
  return (
    <Link to={`/meeting/${id}?provider=${provider}`}>
      <Card className="h-full cursor-pointer transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <CardTitle className="line-clamp-2">{title}</CardTitle>
              {provider && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {provider === "google" ? "Google" : "Outlook"}
                </Badge>
              )}
            </div>
            {isUpcoming && (
              <Badge variant="secondary" className="ml-2 shrink-0">
                <CalendarClock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(date, { addSuffix: true })}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{format(date, "EEEE, MMMM do · h:mm a")}</span>
            </div>
            {location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="truncate">{location}</span>
              </div>
            )}
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>{attendeeCount} attendee{attendeeCount !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Badge variant={briefAvailable ? "default" : "outline"} 
                 className={briefAvailable 
                    ? "bg-primary/20 text-primary hover:bg-primary/30 flex items-center" 
                    : "bg-primary/5 hover:bg-primary/10 flex items-center"}>
            {briefAvailable ? (
              <>
                <MailOpen className="h-3.5 w-3.5 mr-1" />
                Brief Available
              </>
            ) : (
              <>
                <Mail className="h-3.5 w-3.5 mr-1" />
                Brief {isUpcoming ? "Pending" : "Available"}
              </>
            )}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
