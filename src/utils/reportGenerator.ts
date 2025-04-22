
import { Test, TestAttempt } from "@/types";

export interface TestReport {
  testId: string;
  testTitle: string;
  totalAttempts: number;
  averageScore: number;
  studentResults: {
    userId: string;
    userName: string;
    score: number;
    percentage: number;
    completionTime: string; // In minutes:seconds format
  }[];
}

// Function to generate report data from tests and attempts
export const generateTestReport = (
  tests: Test[],
  attempts: TestAttempt[]
): TestReport[] => {
  return tests.map((test) => {
    // Get all attempts for this test
    const testAttempts = attempts.filter((attempt) => attempt.testId === test.id);
    
    // Calculate average score
    const totalScore = testAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const averageScore = testAttempts.length > 0 
      ? totalScore / testAttempts.length 
      : 0;
    
    // Create student results array
    const studentResults = testAttempts.map((attempt) => {
      // Calculate completion time
      const startTime = new Date(attempt.startTime);
      const endTime = new Date(attempt.endTime);
      const completionTimeMs = endTime.getTime() - startTime.getTime();
      const minutes = Math.floor(completionTimeMs / (1000 * 60));
      const seconds = Math.floor((completionTimeMs % (1000 * 60)) / 1000);
      
      return {
        userId: attempt.userId,
        userName: `User ${attempt.userId.substring(0, 5)}`, // We don't have user names stored with attempts
        score: attempt.score,
        percentage: (attempt.score / attempt.totalQuestions) * 100,
        completionTime: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      };
    });
    
    return {
      testId: test.id,
      testTitle: test.title,
      totalAttempts: testAttempts.length,
      averageScore,
      studentResults,
    };
  });
};

// Function to convert report to CSV format
export const convertReportToCSV = (reports: TestReport[]): string => {
  let csvContent = "Test Title,User ID,User Name,Score,Percentage,Completion Time\n";
  
  reports.forEach((report) => {
    report.studentResults.forEach((result) => {
      csvContent += `"${report.testTitle}","${result.userId}","${result.userName}",${result.score},${result.percentage.toFixed(2)}%,"${result.completionTime}"\n`;
    });
  });
  
  return csvContent;
};

// Function to download the report as a CSV file
export const downloadReportAsCSV = (reports: TestReport[]): void => {
  const csvContent = convertReportToCSV(reports);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `test_report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to send report to admins (simulated)
export const sendReportToAdmins = (
  adminEmails: string[],
  reports: TestReport[]
): Promise<void> => {
  console.log(`Sending reports to admins: ${adminEmails.join(", ")}`);
  
  // This is a simulation of sending an email
  // In a real application, this would be a call to a backend API
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Reports sent successfully to all admins");
      resolve();
    }, 1500);
  });
};
