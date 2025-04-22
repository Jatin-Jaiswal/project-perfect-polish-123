
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl text-gray-600 mt-4 mb-8">Page not found</p>
      <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
    </div>
  );
};

export default NotFound;
