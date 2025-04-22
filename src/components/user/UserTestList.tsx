
import { useAuth } from "@/contexts/AuthContext";
import { useTest } from "@/contexts/TestContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

export const UserTestList = () => {
  const { user } = useAuth();
  const { tests } = useTest();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  if (tests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Tests</CardTitle>
          <CardDescription>No tests available at the moment.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const handleStartTest = (testId: string) => {
    navigate(`/test/${testId}`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Tests</CardTitle>
        <CardDescription>Select a test to start</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Time Limit</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">{test.title}</TableCell>
                <TableCell>{test.description}</TableCell>
                <TableCell>{test.timeLimit} min</TableCell>
                <TableCell>{test.questions.length}</TableCell>
                <TableCell>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleStartTest(test.id)}
                  >
                    Start Test
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
