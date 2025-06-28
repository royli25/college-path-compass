
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowLeft } from "lucide-react";
import { useProfileData, getStepCompletion } from "@/hooks/useProfileData";
import AcademicForm from "@/components/profile/AcademicForm";
import ActivitiesForm from "@/components/profile/ActivitiesForm";
import AwardsForm from "@/components/profile/AwardsForm";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfileData();

  const steps = [
    { title: "Academic Profile", component: AcademicForm, stepIndex: 1 },
    { title: "Activities & Leadership", component: ActivitiesForm, stepIndex: 2 },
    { title: "Honors & Awards", component: AwardsForm, stepIndex: 3 }
  ];

  const handleComplete = () => {
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const completedSteps = steps.filter((step) => getStepCompletion(profile, step.stepIndex)).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack} size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-3xl font-medium text-foreground tracking-tight">
              Profile Builder
            </h1>
            <p className="text-base text-muted-foreground">
              Complete all sections to build your comprehensive application profile
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="ultra-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-foreground">Overall Progress</h2>
                <span className="text-2xl font-semibold text-primary">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3 rounded-full" />
              
              {/* Step indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {steps.map((stepInfo, index) => {
                  const isCompleted = getStepCompletion(profile, stepInfo.stepIndex);
                  
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 rounded-lg"
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{stepInfo.title}</p>
                        <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                          {isCompleted ? "Complete" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Forms */}
        <div className="space-y-12">
          <AcademicForm onNext={() => {}} onBack={handleBack} />
          <ActivitiesForm onNext={() => {}} onBack={() => {}} />
          <AwardsForm onNext={handleComplete} onBack={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
