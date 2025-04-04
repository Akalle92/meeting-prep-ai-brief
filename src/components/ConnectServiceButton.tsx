
import { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectServiceButtonProps extends ComponentProps<typeof Button> {
  serviceName: string;
  serviceIcon: React.ReactNode;
  isConnected?: boolean;
}

export function ConnectServiceButton({
  serviceName,
  serviceIcon,
  isConnected = false,
  className,
  ...props
}: ConnectServiceButtonProps) {
  return (
    <Button
      variant={isConnected ? "outline" : "default"}
      className={cn(
        "w-full justify-start",
        isConnected && "border-green-500 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {serviceIcon}
          <span className="ml-2">{serviceName}</span>
        </div>
        <div className="flex items-center">
          {isConnected ? (
            <span className="text-xs">Connected</span>
          ) : (
            <ExternalLink className="h-4 w-4 ml-2" />
          )}
        </div>
      </div>
    </Button>
  );
}
