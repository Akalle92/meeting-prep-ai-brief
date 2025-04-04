
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ConnectServiceButton } from "@/components/ConnectServiceButton";
import { Calendar, Mail, BellRing, BrainCircuit, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [connectedServices, setConnectedServices] = useState<{[key: string]: boolean}>({
    googleCalendar: false,
    outlookCalendar: false,
    gmail: false,
    outlookEmail: false
  });
  
  const handleConnectService = (service: string) => {
    // In a real app, this would open OAuth flow
    toast({
      title: "Connecting Service",
      description: `This would start the OAuth flow for ${service} in a real app.`,
    });
    
    // Simulate successful connection
    setConnectedServices({
      ...connectedServices,
      [service]: true
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and application preferences
          </p>
        </div>
        
        <Tabs defaultValue="connections" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="ai-preferences">AI Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connections">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar Services</CardTitle>
                  <CardDescription>
                    Connect your calendar services to import meetings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ConnectServiceButton
                    serviceName="Google Calendar"
                    serviceIcon={<Calendar className="h-4 w-4 text-primary" />}
                    isConnected={connectedServices.googleCalendar}
                    onClick={() => handleConnectService('googleCalendar')}
                  />
                  <ConnectServiceButton
                    serviceName="Outlook Calendar"
                    serviceIcon={<Calendar className="h-4 w-4 text-primary" />}
                    isConnected={connectedServices.outlookCalendar}
                    onClick={() => handleConnectService('outlookCalendar')}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Email Services</CardTitle>
                  <CardDescription>
                    Connect your email services to analyze meeting-related communications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ConnectServiceButton
                    serviceName="Gmail"
                    serviceIcon={<Mail className="h-4 w-4 text-primary" />}
                    isConnected={connectedServices.gmail}
                    onClick={() => handleConnectService('gmail')}
                  />
                  <ConnectServiceButton
                    serviceName="Outlook Email"
                    serviceIcon={<Mail className="h-4 w-4 text-primary" />}
                    isConnected={connectedServices.outlookEmail}
                    onClick={() => handleConnectService('outlookEmail')}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control when and how you receive notifications about meeting briefs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="brief-ready">Brief Ready Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when a new meeting brief is ready
                      </p>
                    </div>
                    <Switch id="brief-ready" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reminder">Meeting Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminders before meetings with links to briefs
                      </p>
                    </div>
                    <Switch id="reminder" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-delivery">Email Delivery</Label>
                      <p className="text-sm text-muted-foreground">
                        Also send meeting briefs to your email
                      </p>
                    </div>
                    <Switch id="email-delivery" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prep-time">Brief Preparation Time</Label>
                  <Select defaultValue="24">
                    <SelectTrigger id="prep-time">
                      <SelectValue placeholder="Select hours before meeting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 hours before</SelectItem>
                      <SelectItem value="6">6 hours before</SelectItem>
                      <SelectItem value="12">12 hours before</SelectItem>
                      <SelectItem value="24">24 hours before</SelectItem>
                      <SelectItem value="48">48 hours before</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    How far in advance meeting briefs should be generated
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-preferences">
            <Card>
              <CardHeader>
                <CardTitle>AI Preferences</CardTitle>
                <CardDescription>
                  Customize how the AI generates meeting briefs and analyzes communications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-analysis">Email Analysis</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow AI to analyze emails related to meeting participants
                      </p>
                    </div>
                    <Switch id="email-analysis" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="talking-points">Generate Talking Points</Label>
                      <p className="text-sm text-muted-foreground">
                        Include AI-generated talking points in meeting briefs
                      </p>
                    </div>
                    <Switch id="talking-points" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="action-items">Suggest Action Items</Label>
                      <p className="text-sm text-muted-foreground">
                        Include AI-suggested action items based on previous communications
                      </p>
                    </div>
                    <Switch id="action-items" defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brief-detail">Brief Detail Level</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger id="brief-detail">
                      <SelectValue placeholder="Select detail level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise (shortest)</SelectItem>
                      <SelectItem value="balanced">Balanced (recommended)</SelectItem>
                      <SelectItem value="detailed">Detailed (comprehensive)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    Control how detailed your meeting briefs should be
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Manage data privacy and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-storage">Local Data Storage</Label>
                      <p className="text-sm text-muted-foreground">
                        Store meeting data on your device when possible
                      </p>
                    </div>
                    <Switch id="data-storage" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="third-party">Third-Party Lookup</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow searching public sources for participant information
                      </p>
                    </div>
                    <Switch id="third-party" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-retention">Limited Data Retention</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically delete meeting data after 30 days
                      </p>
                    </div>
                    <Switch id="data-retention" />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="destructive" onClick={() => 
                    toast({
                      title: "Privacy Action",
                      description: "This would delete all your data in a real app."
                    })
                  }>
                    <Shield className="h-4 w-4 mr-2" />
                    Delete All My Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
