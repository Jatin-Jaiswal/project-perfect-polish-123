
import { Test, TestAttempt } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface TestResultsProps {
  test: Test;
  attempt: TestAttempt;
}

export const TestResults = ({ test, attempt }: TestResultsProps) => {
  const navigate = useNavigate();
  
  const percentageScore = Math.round((attempt.score / attempt.totalQuestions) * 100);
  const startTime = new Date(attempt.startTime);
  const endTime = new Date(attempt.endTime);
  const durationInMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
  
  const getResultMessage = () => {
    if (percentageScore >= 90) return "Excellent job!";
    if (percentageScore >= 70) return "Great work!";
    if (percentageScore >= 50) return "Good effort!";
    return "Keep practicing!";
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Test Results</CardTitle>
        <CardDescription>
          {test.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-4xl font-bold">{percentageScore}%</h3>
          <p className="text-muted-foreground mt-1">Score</p>
          <p className="font-medium mt-2">{getResultMessage()}</p>
        </div>
        
        <Progress value={percentageScore} className="h-2" />
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{attempt.score}</p>
            <p className="text-muted-foreground">Correct Answers</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{attempt.totalQuestions - attempt.score}</p>
            <p className="text-muted-foreground">Incorrect Answers</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-semibold">Detailed Results</h3>
          
          <div className="space-y-2">
            {test.questions.map((question) => {
              const userAnswer = attempt.answers[question.questionNo];
              const isCorrect = userAnswer === question.correctOption;
              
              return (
                <div 
                  key={question.questionNo}
                  className={`p-4 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
                >
                  <p className="font-medium">Question {question.questionNo}: {question.question}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className={userAnswer === 1 ? (isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium') : ''}>
                      A: {question.option1} {question.correctOption === 1 && !isCorrect && "(Correct Answer)"}
                    </p>
                    <p className={userAnswer === 2 ? (isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium') : ''}>
                      B: {question.option2} {question.correctOption === 2 && !isCorrect && "(Correct Answer)"}
                    </p>
                    <p className={userAnswer === 3 ? (isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium') : ''}>
                      C: {question.option3} {question.correctOption === 3 && !isCorrect && "(Correct Answer)"}
                    </p>
                    <p className={userAnswer === 4 ? (isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium') : ''}>
                      D: {question.option4} {question.correctOption === 4 && !isCorrect && "(Correct Answer)"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="rounded-md bg-muted p-4">
          <h4 className="font-medium mb-2">Test Summary</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p className="text-muted-foreground">Time taken:</p>
            <p>{durationInMinutes} minutes</p>
            <p className="text-muted-foreground">Started at:</p>
            <p>{startTime.toLocaleString()}</p>
            <p className="text-muted-foreground">Completed at:</p>
            <p>{endTime.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={() => navigate("/")}
          className="w-full"
        >
          Return to Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
};
