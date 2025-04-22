
import { Question } from "@/types";

export const parseCSV = (csvContent: string): Question[] => {
  // Split by lines and remove the header
  const lines = csvContent.trim().split("\n");
  const header = lines[0].toLowerCase();
  
  // Check if the CSV has the correct format
  if (!header.includes("question") || 
      !header.includes("option1") || 
      !header.includes("option2") || 
      !header.includes("option3") || 
      !header.includes("option4") || 
      !header.includes("correctansoption")) {
    throw new Error("CSV format is incorrect. Please use the format: Q.NO, QUESTION, OPTION1, OPTION2, OPTION3, OPTION4, CORRECTANSOPTION");
  }
  
  const questions: Question[] = [];
  
  // Start from index 1 to skip the header
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    
    const columns = lines[i].split(",").map(col => col.trim());
    
    // Ensure we have all required columns
    if (columns.length < 7) {
      throw new Error(`Line ${i + 1} has missing columns`);
    }
    
    const question: Question = {
      questionNo: parseInt(columns[0]) || i,
      question: columns[1],
      option1: columns[2],
      option2: columns[3],
      option3: columns[4],
      option4: columns[5],
      correctOption: parseInt(columns[6])
    };
    
    questions.push(question);
  }
  
  return questions;
};
