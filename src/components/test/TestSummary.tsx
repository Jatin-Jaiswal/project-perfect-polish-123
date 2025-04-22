
import { useState } from "react";
import { Test, TestAttempt } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface TestSummaryProps {
  test: Test;
  answers: Record<number, number>;
  onSubmit: () => void;
  onReturn: (questionNo: number) => void;
}

export const TestSummary = ({ test, answers, onSubmit, onReturn }: TestSummaryProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const totalQuestions = test.questions.length;
  const answeredQuestions = Object.keys(answers).length;
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    onSubmit();
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Test Summary</CardTitle>
        <CardDescription>
          Review your answers before submitting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <p className="text-muted-foreground">Test Name</p>
          <p className="font-medium">{test.title}</p>
        </div>
        
        <div className="grid gap-2">
          <p className="text-muted-foreground">Progress</p>
          <p className="font-medium">
            {answeredQuestions} of {totalQuestions} questions answered
            ({Math.round((answeredQuestions / totalQuestions) * 100)}%)
          </p>
        </div>
        
        <div className="space-y-2">
          <p className="text-muted-foreground">Question Status</p>
          <div className="grid grid-cols-5 gap-2">
            {test.questions.map((question) => {
              const isAnswered = answers[question.questionNo] !== undefined;
              
              return (
                <Button
                  key={question.questionNo}
                  variant={isAnswered ? "default" : "outline"}
                  size="sm"
                  className={`h-10 ${isAnswered ? "" : "border-dashed"}`}
                  onClick={() => onReturn(question.questionNo)}
                >
                  {question.questionNo}
                </Button>
              );
            })}
          </div>
        </div>
        
        {answeredQuestions < totalQuestions && (
          <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
            <p className="text-yellow-700 text-sm">
              You have {totalQuestions - answeredQuestions} unanswered questions. 
              Click on the question numbers above to review them.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Test"}
        </Button>
      </CardFooter>
    </Card>
  );
};
