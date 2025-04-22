
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface TestTimerProps {
  totalTimeInMinutes: number;
  onTimeUp: () => void;
}

export const TestTimer = ({ totalTimeInMinutes, onTimeUp }: TestTimerProps) => {
  const totalTimeInSeconds = totalTimeInMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalTimeInSeconds);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [onTimeUp]);
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const progressPercent = (timeLeft / totalTimeInSeconds) * 100;
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Time Remaining</span>
            <span className="text-lg font-semibold">{formattedTime}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
