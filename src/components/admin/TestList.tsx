
import { useTest } from "@/contexts/TestContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const AdminTestList = () => {
  const { tests, deleteTest } = useTest();
  
  if (tests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tests</CardTitle>
          <CardDescription>No tests available. Upload a new test to get started.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Tests</CardTitle>
        <CardDescription>Manage your uploaded tests</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Time Limit</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Created</TableHead>
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
                <TableCell>{new Date(test.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteTest(test.id)}
                  >
                    Delete
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
