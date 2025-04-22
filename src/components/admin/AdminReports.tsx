import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTest } from "@/contexts/TestContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  generateTestReport, 
  downloadReportAsCSV, 
  sendReportToAdmins,
  TestReport
} from "@/utils/reportGenerator";
import { toast } from "@/components/ui/use-toast";
import { Loader2, SendIcon, Download, Plus, Trash2 } from "lucide-react";

export const AdminReports = () => {
  const { getAllAdminEmails, addAdminEmail, removeAdminEmail } = useAuth();
  const { tests } = useTest();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<TestReport[] | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [adminEmails, setAdminEmails] = useState<string[]>([]);

  useEffect(() => {
    setAdminEmails(getAllAdminEmails());
  }, []);

  useEffect(() => {
    const checkAndSendReport = () => {
      const now = new Date();
      if (now.getHours() === 20 && now.getMinutes() === 0) {
        handleGenerateAndSendReports();
      }
    };

    const interval = setInterval(checkAndSendReport, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTestAttempts = () => {
    const storedAttempts = localStorage.getItem("attempts");
    return storedAttempts ? JSON.parse(storedAttempts) : [];
  };

  const handleGenerateAndSendReports = async () => {
    setIsGenerating(true);
    try {
      const attempts = getTestAttempts();
      const reports = generateTestReport(tests, attempts);
      await sendReportToAdmins(getAllAdminEmails(), reports);
      toast({
        title: "Reports Sent",
        description: `Reports have been sent to all admin emails at ${new Date().toLocaleTimeString()}`,
      });
    } catch (error) {
      console.error("Error sending reports:", error);
      toast({
        title: "Error",
        description: "Failed to generate and send reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddAdmin = () => {
    if (!newAdminEmail) return;
    addAdminEmail(newAdminEmail);
    setAdminEmails(getAllAdminEmails());
    setNewAdminEmail("");
    toast({
      title: "Admin Added",
      description: `${newAdminEmail} has been added as an admin.`,
    });
  };

  const handleRemoveAdmin = (email: string) => {
    removeAdminEmail(email);
    setAdminEmails(getAllAdminEmails());
    toast({
      title: "Admin Removed",
      description: `${email} has been removed from admins.`,
    });
  };

  const handleGenerateReports = () => {
    setIsGenerating(true);
    
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
          Manage admin emails and reports. Reports are automatically sent daily at 8:00 PM.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Admin Emails</h3>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Add new admin email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
            />
            <Button onClick={handleAddAdmin} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {adminEmails.map((email) => (
              <div key={email} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span>{email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAdmin(email)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Manual Report Controls</h3>
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
        </div>
      </CardContent>
    </Card>
  );
};
