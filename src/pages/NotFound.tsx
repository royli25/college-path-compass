import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Frown } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-6">
      <Frown className="h-24 w-24 text-primary mb-6" />
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <h2 className="text-2xl font-bold text-foreground mt-4 mb-2">
        Page Not Found
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Go back to Homepage</Link>
      </Button>
    </div>
  );
};

export default NotFound;
