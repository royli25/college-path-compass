import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";
import { useProfileData, getStepCompletion } from "@/hooks/useProfileData";
import BackgroundForm from "@/components/profile/BackgroundForm";
import AcademicForm from "@/components/profile/AcademicForm";
import ActivitiesForm from "@/components/profile/ActivitiesForm";
import AwardsForm from "@/components/profile/AwardsForm";

const ProfileEdit = () => {
  const { step } = useParams();
  const navigate = useNavigate();
  const { data: profile } = useProfileData();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Background Information", component: BackgroundForm },
    { title: "Academic Profile", component: AcademicForm },
    { title: "Activities & Leadership", component: ActivitiesForm },
    { title: "Honors & Awards", component: AwardsForm }
  ];

  useEffect(() => {
    if (step) {
      const stepNum = parseInt(step);
      if (stepNum >= 0 && stepNum < steps.length) {
        setCurrentStep(stepNum);
      }
    }
  }, [step]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      navigate(`/profile/edit/${nextStep}`);
    } else {
      // Profile completed
      navigate('/profile');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      navigate(`/profile/edit/${prevStep}`);
    } else {
      navigate('/profile');
    }
  };

  const completedSteps = steps.filter((_, index) => getStepCompletion(profile, index)).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-medium text-foreground tracking-tight">
            Profile Builder
          </h1>
          <p className="text-base text-muted-foreground">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </p>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {steps.map((stepInfo, index) => {
                  const isCompleted = getStepCompletion(profile, index);
                  const isCurrent = index === currentStep;
                  
                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                        isCurrent ? 'bg-primary/10 border border-primary/20' : ''
                      }`}
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

        {/* Current Step Form */}
        <CurrentStepComponent onNext={handleNext} onBack={handleBack} />
      </div>
    </div>
  );
};

export default ProfileEdit;
