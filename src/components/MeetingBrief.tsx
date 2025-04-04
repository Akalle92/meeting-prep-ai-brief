
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, FileText, Lightbulb, ListTodo } from "lucide-react";

interface MeetingBriefProps {
  title: string;
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

export function MeetingBrief({
  title,
  summary,
  recentEmails = [],
  actionItems = [],
  talkingPoints = [],
}: MeetingBriefProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
          AI Generated Brief
        </CardTitle>
        <CardDescription>
          Automatically generated based on calendar and email data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="talking-points">Talking Points</TabsTrigger>
            <TabsTrigger value="action-items">Action Items</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p>{summary}</p>
            </div>
            
            {recentEmails.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  Recent Communications
                </h4>
                <div className="space-y-3">
                  {recentEmails.map((email) => (
                    <div key={email.id} className="text-sm border rounded-md p-3">
                      <div className="font-medium">{email.subject}</div>
                      <div className="text-muted-foreground text-xs mt-1">
                        {email.date.toLocaleDateString()}
                      </div>
                      <p className="mt-2 text-muted-foreground">{email.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="talking-points" className="space-y-3">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-muted-foreground" />
              Suggested Talking Points
            </h4>
            {talkingPoints.length > 0 ? (
              <ul className="space-y-2">
                {talkingPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-primary/10 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No talking points available for this meeting yet.
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="action-items" className="space-y-3">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <ListTodo className="h-4 w-4 mr-2 text-muted-foreground" />
              Action Items
            </h4>
            {actionItems.length > 0 ? (
              <ul className="space-y-2">
                {actionItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-md px-2 py-0.5 mr-2 mt-0.5 text-xs font-medium">
                      TODO
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No action items available for this meeting yet.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
