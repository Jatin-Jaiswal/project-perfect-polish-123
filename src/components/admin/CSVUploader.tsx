
import { useState } from "react";
import { parseCSV } from "@/utils/csvParser";
import { useAuth } from "@/contexts/AuthContext";
import { useTest } from "@/contexts/TestContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Test } from "@/types";

export const CSVUploader = () => {
  const { user } = useAuth();
  const { addTest } = useTest();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30); // Default 30 minutes
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  if (!user?.isAdmin) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!title || !description || !timeLimit || !file) {
      setError("Please fill in all fields and select a CSV file");
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Read the file
      const fileContent = await file.text();
      
      // Parse CSV
      const questions = parseCSV(fileContent);
      
      if (questions.length === 0) {
        throw new Error("No valid questions found in the CSV file");
      }
      
      // Create a new test
      const newTest: Test = {
        id: `test-${Date.now()}`,
        title,
        description,
        timeLimit,
        questions,
        createdAt: new Date().toISOString(),
        createdBy: user.id
      };
      
      // Add the test
      addTest(newTest);
      
      // Reset form
      setTitle("");
      setDescription("");
      setTimeLimit(30);
      setFile(null);
      
      setSuccess("Test uploaded successfully!");
    } catch (err) {
      setError((err as Error).message || "Failed to upload test");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Test</CardTitle>
        <CardDescription>
          Upload a CSV file with questions to create a new test. The CSV should have the following format:
          <code className="block mt-2 p-2 bg-muted rounded text-xs">
            Q.NO,QUESTION,OPTION1,OPTION2,OPTION3,OPTION4,CORRECTANSOPTION
          </code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Test Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter test title"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Test Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter test description"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
            <Input
              id="timeLimit"
              type="number"
              min={1}
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="csvFile">CSV File</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
            />
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}
          
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Test"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
