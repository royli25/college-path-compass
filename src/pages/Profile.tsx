
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { useProfileData, calculateProfileStrength } from "@/hooks/useProfileData";

const Profile = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfileData();
  const strength = calculateProfileStrength(profile);

  // Redirect to profile edit page immediately
  useEffect(() => {
    navigate('/profile/edit');
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-medium text-foreground tracking-tight">Profile Builder</h1>
          <p className="text-base text-muted-foreground">
            Complete your academic profile to build a strong application
          </p>
        </div>

        <Separator />

        {/* Progress Overview */}
        <Card className="ultra-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-foreground">Overall Progress</h2>
                <span className="text-xl font-semibold text-primary">{strength.overall}%</span>
              </div>
              <Progress value={strength.overall} className="h-3 rounded-full" />
              <p className="text-sm text-muted-foreground">
                Complete all sections to build a strong application profile
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Card */}
        <Card className="ultra-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-foreground mb-2">Complete Your Profile</h2>
                <p className="text-muted-foreground">
                  Fill out your academic information, activities, and awards to build your application profile
                </p>
              </div>
              <Button onClick={() => navigate('/profile/edit')} className="rounded-xl">
                Start Building
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
