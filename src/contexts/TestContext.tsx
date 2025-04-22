
import React, { createContext, useContext, useState, useEffect } from "react";
import { Test, Question, TestAttempt } from "@/types";

interface TestContextType {
  tests: Test[];
  activeTest: Test | null;
  currentTestAttempt: TestAttempt | null;
  addTest: (test: Test) => void;
  deleteTest: (testId: string) => void;
  getTest: (testId: string) => Test | undefined;
  setActiveTest: (testId: string) => void;
  startTest: (testId: string, userId: string) => void;
  submitAnswer: (questionNo: number, selectedOption: number) => void;
  finishTest: () => TestAttempt | null;
  getUserAttempts: (userId: string) => TestAttempt[];
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [activeTest, setActiveTestState] = useState<Test | null>(null);
  const [currentTestAttempt, setCurrentTestAttempt] = useState<TestAttempt | null>(null);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);

  useEffect(() => {
    // Load tests from localStorage
    const storedTests = localStorage.getItem("tests");
    if (storedTests) {
      setTests(JSON.parse(storedTests));
    } else {
      // Add sample test if none exist
      const sampleTest: Test = {
        id: "sample-test-1",
        title: "Sample Test",
        description: "This is a sample test with basic questions",
        timeLimit: 10, // 10 minutes
        questions: [
          {
            questionNo: 1,
            question: "What is 2 + 2?",
            option1: "3",
            option2: "4",
            option3: "5",
            option4: "6",
            correctOption: 2
          },
          {
            questionNo: 2,
            question: "What is the capital of France?",
            option1: "London",
            option2: "Berlin",
            option3: "Paris",
            option4: "Madrid",
            correctOption: 3
          }
        ],
        createdAt: new Date().toISOString(),
        createdBy: "system"
      };
      setTests([sampleTest]);
      localStorage.setItem("tests", JSON.stringify([sampleTest]));
    }

    // Load attempts from localStorage
    const storedAttempts = localStorage.getItem("attempts");
    if (storedAttempts) {
      setAttempts(JSON.parse(storedAttempts));
    }
  }, []);

  // Save tests to localStorage whenever they change
  useEffect(() => {
    if (tests.length > 0) {
      localStorage.setItem("tests", JSON.stringify(tests));
    }
  }, [tests]);

  // Save attempts to localStorage whenever they change
  useEffect(() => {
    if (attempts.length > 0) {
      localStorage.setItem("attempts", JSON.stringify(attempts));
    }
  }, [attempts]);

  const addTest = (test: Test) => {
    setTests([...tests, test]);
  };

  const deleteTest = (testId: string) => {
    setTests(tests.filter(test => test.id !== testId));
  };

  const getTest = (testId: string) => {
    return tests.find(test => test.id === testId);
  };

  const setActiveTest = (testId: string) => {
    const test = tests.find(test => test.id === testId);
    setActiveTestState(test || null);
  };

  const startTest = (testId: string, userId: string) => {
    const test = tests.find(test => test.id === testId);
    if (!test) return;

    setActiveTestState(test);
    const newAttempt: TestAttempt = {
      testId,
      userId,
      answers: {},
      score: 0,
      totalQuestions: test.questions.length,
      startTime: new Date().toISOString(),
      endTime: ""
    };
    setCurrentTestAttempt(newAttempt);
  };

  const submitAnswer = (questionNo: number, selectedOption: number) => {
    if (!currentTestAttempt) return;
    
    setCurrentTestAttempt({
      ...currentTestAttempt,
      answers: {
        ...currentTestAttempt.answers,
        [questionNo]: selectedOption
      }
    });
  };

  const finishTest = () => {
    if (!currentTestAttempt || !activeTest) return null;
    
    // Calculate score
    let score = 0;
    activeTest.questions.forEach(question => {
      if (currentTestAttempt.answers[question.questionNo] === question.correctOption) {
        score++;
      }
    });
    
    const completedAttempt: TestAttempt = {
      ...currentTestAttempt,
      score,
      endTime: new Date().toISOString()
    };
    
    setAttempts([...attempts, completedAttempt]);
    setCurrentTestAttempt(null);
    setActiveTestState(null);
    
    return completedAttempt;
  };

  const getUserAttempts = (userId: string) => {
    return attempts.filter(attempt => attempt.userId === userId);
  };

  return (
    <TestContext.Provider 
      value={{ 
        tests, 
        activeTest, 
        currentTestAttempt,
        addTest, 
        deleteTest, 
        getTest, 
        setActiveTest,
        startTest,
        submitAnswer,
        finishTest,
        getUserAttempts
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error("useTest must be used within a TestProvider");
  }
  return context;
};
