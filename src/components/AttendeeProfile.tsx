
import { ExternalLink, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AttendeeProfileProps {
  name: string;
  email: string;
  role?: string;
  company?: string;
  phone?: string;
  avatarUrl?: string;
  recentEmails?: number;
  linkedInUrl?: string;
}

export function AttendeeProfile({
  name,
  email,
  role,
  company,
  phone,
  avatarUrl,
  recentEmails,
  linkedInUrl,
}: AttendeeProfileProps) {
  // Get initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base">{name}</CardTitle>
          {role && company && (
            <p className="text-sm text-muted-foreground">
              {role} at {company}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <a
              href={`mailto:${email}`}
              className="text-primary hover:underline"
            >
              {email}
            </a>
          </div>

          {phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <a
                href={`tel:${phone}`}
                className="text-primary hover:underline"
              >
                {phone}
              </a>
            </div>
          )}

          {recentEmails !== undefined && (
            <div className="mt-4">
              <Badge variant="secondary">
                {recentEmails} recent email{recentEmails !== 1 ? "s" : ""}
              </Badge>
            </div>
          )}

          {linkedInUrl && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(linkedInUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                LinkedIn Profile
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
