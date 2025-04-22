
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTest } from "@/contexts/TestContext";
import { Header } from "@/components/layout/Header";
import { TestResults } from "@/components/test/TestResults";

const ResultsPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTest, getUserAttempts } = useTest();
  
  const test = testId ? getTest(testId) : undefined;
  
  useEffect(() => {
    if (!user || !test) {
      navigate("/");
    }
  }, [user, test, navigate]);
  
  if (!user || !test) {
    return null;
  }
  
  const userAttempts = getUserAttempts(user.id);
  const latestAttempt = userAttempts
    .filter(a => a.testId === test.id)
    .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())[0];
  
  if (!latestAttempt) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <TestResults 
          test={test}
          attempt={latestAttempt}
        />
      </main>
    </div>
  );
};

export default ResultsPage;
