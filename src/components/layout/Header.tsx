
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Test Application</h1>
        
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {user.isAdmin ? "Admin: " : "User: "} 
              {user.name}
            </span>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
