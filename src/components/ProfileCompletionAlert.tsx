import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileCompletionAlertProps {
  completionPercentage: number;
}

const ProfileCompletionAlert = ({ completionPercentage }: ProfileCompletionAlertProps) => {
  if (completionPercentage > 80) return null;

  return (
    <Alert className="border-red-400 bg-red-100 text-red-900 mb-6 backdrop-blur-md">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Complete Your Profile</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="flex items-end justify-between">
          <div>
            <p>Your profile is {completionPercentage}% complete. Complete your profile to get accurate strength ratings and better school recommendations.</p>
          </div>
          <Link to="/profile">
            <Button variant="outline" size="sm" className="ml-4">
              Complete Profile
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ProfileCompletionAlert;
