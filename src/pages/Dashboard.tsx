
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { AdminTestList } from "@/components/admin/TestList";
import { CSVUploader } from "@/components/admin/CSVUploader";
import { AdminReports } from "@/components/admin/AdminReports";
import { UserTestList } from "@/components/user/UserTestList";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {user.isAdmin ? "Admin Dashboard" : "Available Tests"}
        </h1>
        
        {user.isAdmin ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <CSVUploader />
              <AdminReports />
            </div>
            <div className="space-y-8">
              <AdminTestList />
            </div>
          </div>
        ) : (
          <UserTestList />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
