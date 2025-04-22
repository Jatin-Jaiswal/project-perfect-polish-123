
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTest } from "@/contexts/TestContext";
import { Header } from "@/components/layout/Header";
import { TestQuestion } from "@/components/test/TestQuestion";
import { TestTimer } from "@/components/test/TestTimer";
import { TestSummary } from "@/components/test/TestSummary";
import { Button } from "@/components/ui/button";

enum TestStatus {
  STARTING,
  IN_PROGRESS,
  REVIEW,
}

const TestPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTest, startTest, submitAnswer, finishTest, currentTestAttempt } = useTest();
  
  const [status, setStatus] = useState<TestStatus>(TestStatus.STARTING);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSelectedOption, setCurrentSelectedOption] = useState<number | undefined>(undefined);
  
  const test = testId ? getTest(testId) : undefined;
  
  useEffect(() => {
    if (!user || !test) {
      navigate("/");
      return;
    }
    
    if (status === TestStatus.STARTING) {
      startTest(test.id, user.id);
      setStatus(TestStatus.IN_PROGRESS);
    }
  }, [user, test, status, navigate, startTest]);
  
  if (!user || !test || !currentTestAttempt) {
    return null;
  }
  
  const questions = test.questions;
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleSelectOption = (questionNo: number, option: number) => {
    submitAnswer(questionNo, option);
    setCurrentSelectedOption(option);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentSelectedOption(undefined);
    } else {
      setStatus(TestStatus.REVIEW);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Removed the code that sets the previously selected option
      setCurrentSelectedOption(undefined);
    }
  };
  
  const handleSubmitTest = () => {
    const result = finishTest();
    if (result) {
      navigate(`/results/${test.id}`);
    }
  };
  
  const handleTimeUp = () => {
    handleSubmitTest();
  };
  
  const handleGoToQuestion = (questionNo: number) => {
    const index = questions.findIndex(q => q.questionNo === questionNo);
    if (index !== -1) {
      setCurrentQuestionIndex(index);
      setCurrentSelectedOption(undefined);
      setStatus(TestStatus.IN_PROGRESS);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{test.title}</h1>
          
          <div className="w-64">
            <TestTimer 
              totalTimeInMinutes={test.timeLimit} 
              onTimeUp={handleTimeUp} 
            />
          </div>
        </div>
        
        {status === TestStatus.IN_PROGRESS && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatus(TestStatus.REVIEW)}
              >
                Review Answers
              </Button>
            </div>
            
            <TestQuestion
              question={currentQuestion}
              selectedOption={currentSelectedOption}
              onSelectOption={handleSelectOption}
              canNavigate={true}
              onNavigateNext={handleNextQuestion}
              onNavigatePrev={handlePrevQuestion}
              isFirst={currentQuestionIndex === 0}
              isLast={currentQuestionIndex === questions.length - 1}
            />
          </>
        )}
        
        {status === TestStatus.REVIEW && (
          <TestSummary
            test={test}
            answers={currentTestAttempt.answers}
            onSubmit={handleSubmitTest}
            onReturn={handleGoToQuestion}
          />
        )}
      </main>
    </div>
  );
};

export default TestPage;
