
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface TestQuestionProps {
  question: Question;
  selectedOption?: number;
  onSelectOption: (questionNo: number, option: number) => void;
  canNavigate: boolean;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  isAnswered: boolean;  // New prop to check if the question has been answered
}

export const TestQuestion = ({
  question,
  selectedOption,
  onSelectOption,
  canNavigate,
  onNavigateNext,
  onNavigatePrev,
  isFirst,
  isLast,
  isAnswered
}: TestQuestionProps) => {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Question {question.questionNo}</CardTitle>
        <CardDescription className="text-lg font-medium mt-2">
          {question.question}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption !== undefined ? selectedOption.toString() : undefined}
          onValueChange={(value) => onSelectOption(question.questionNo, parseInt(value))}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id={`q${question.questionNo}-option1`} />
            <Label htmlFor={`q${question.questionNo}-option1`} className="text-base">{question.option1}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id={`q${question.questionNo}-option2`} />
            <Label htmlFor={`q${question.questionNo}-option2`} className="text-base">{question.option2}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id={`q${question.questionNo}-option3`} />
            <Label htmlFor={`q${question.questionNo}-option3`} className="text-base">{question.option3}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4" id={`q${question.questionNo}-option4`} />
            <Label htmlFor={`q${question.questionNo}-option4`} className="text-base">{question.option4}</Label>
          </div>
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onNavigatePrev}
          disabled={!canNavigate || isFirst}
        >
          Previous
        </Button>
        
        <Button
          variant="default"
          onClick={onNavigateNext}
          disabled={!canNavigate || (!isAnswered && !isLast)}
        >
          {isLast ? "Review Answers" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};
