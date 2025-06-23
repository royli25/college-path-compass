import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileCompletionAlertProps {
  completionPercentage: number;
}

const ProfileCompletionAlert = ({ completionPercentage }: ProfileCompletionAlertProps) => {
  if (completionPercentage >= 100) return null;

  return (
    <Alert className="flex items-center justify-between p-3">
      <div className="flex items-center">
        <AlertCircle className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">
          Your profile is {completionPercentage}% complete. Finish it for better recommendations.
        </span>
      </div>
      <Link to="/profile/edit/0">
        <Button variant="secondary" size="sm">
          Complete Profile
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </Alert>
  );
};

export default ProfileCompletionAlert;
