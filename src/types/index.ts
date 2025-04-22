
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Question {
  questionNo: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questions: Question[];
  createdAt: string;
  createdBy: string;
}

export interface TestAttempt {
  testId: string;
  userId: string;
  answers: Record<number, number>; // questionNo -> selectedOption
  score: number;
  totalQuestions: number;
  startTime: string;
  endTime: string;
}
