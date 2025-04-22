
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTest } from "@/contexts/TestContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  generateTestReport, 
  downloadReportAsCSV, 
  sendReportToAdmins,
  TestReport
} from "@/utils/reportGenerator";
import { toast } from "@/components/ui/use-toast";
import { Loader2, SendIcon, Download } from "lucide-react";

export const AdminReports = () => {
  const { getAllAdminEmails } = useAuth();
  const { tests } = useTest();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<TestReport[] | null>(null);
  
  // Get all test attempts
  const getTestAttempts = () => {
    const storedAttempts = localStorage.getItem("attempts");
    return storedAttempts ? JSON.parse(storedAttempts) : [];
  };
  
  const handleGenerateReports = () => {
    setIsGenerating(true);
    
    // Simulate processing time
    setTimeout(() => {
      try {
        const attempts = getTestAttempts();
        const reports = generateTestReport(tests, attempts);
        setGeneratedReports(reports);
        
        toast({
          title: "Reports Generated",
          description: `Generated reports for ${reports.length} tests with ${reports.reduce((sum, r) => sum + r.totalAttempts, 0)} total attempts.`,
        });
      } catch (error) {
        console.error("Error generating reports:", error);
        toast({
          title: "Error",
          description: "Failed to generate reports. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };
  
  const handleDownloadReports = () => {
    if (!generatedReports) return;
    
    try {
      downloadReportAsCSV(generatedReports);
      toast({
        title: "Download Started",
        description: "The report has been downloaded as a CSV file.",
      });
    } catch (error) {
      console.error("Error downloading reports:", error);
      toast({
        title: "Error",
        description: "Failed to download reports. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSendReports = async () => {
    if (!generatedReports) return;
    
    setIsSending(true);
    try {
      const adminEmails = getAllAdminEmails();
      await sendReportToAdmins(adminEmails, generatedReports);
      
      toast({
        title: "Reports Sent",
        description: `Reports have been sent to ${adminEmails.length} admin email(s).`,
      });
    } catch (error) {
      console.error("Error sending reports:", error);
      toast({
        title: "Error",
        description: "Failed to send reports to admins. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const hasData = tests.length > 0 && getTestAttempts().length > 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Reports</CardTitle>
        <CardDescription>
          Generate and send test reports to all administrators
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasData ? (
          <p className="text-muted-foreground">
            No test data available. Reports will be available once students have taken tests.
          </p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleGenerateReports} 
                disabled={isGenerating}
                variant="outline"
              >
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Reports
              </Button>
              
              {generatedReports && (
                <>
                  <Button 
                    onClick={handleDownloadReports} 
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                  
                  <Button 
                    onClick={handleSendReports} 
                    disabled={isSending}
                  >
                    {isSending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <SendIcon className="mr-2 h-4 w-4" />
                    )}
                    Send to Admins
                  </Button>
                </>
              )}
            </div>
            
            {generatedReports && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Report Summary</h3>
                <div className="border rounded-md p-4 space-y-2">
                  {generatedReports.map((report) => (
                    <div key={report.testId} className="border-b pb-2 last:border-b-0 last:pb-0">
                      <h4 className="font-medium">{report.testTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        Total Attempts: {report.totalAttempts} | 
                        Average Score: {report.averageScore.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
