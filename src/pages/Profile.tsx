
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfileData, getStepCompletion, calculateProfileStrength } from "@/hooks/useProfileData";

const Profile = () => {
  const { data: profile, isLoading } = useProfileData();
  const strength = calculateProfileStrength(profile);

  const onboardingSteps = [
    {
      title: "Background Information",
      description: "Tell us about your personal and academic background",
      fields: ["Gender", "Citizenship", "Race/Ethnicity", "First Generation", "Income Bracket", "High School", "Class Rank"],
      stepIndex: 0
    },
    {
      title: "Academic Profile", 
      description: "Share your GPA, test scores, and coursework",
      fields: ["GPA (Unweighted)", "GPA (Weighted)", "SAT/ACT Score", "AP/IB Courses", "Current Year Courses"],
      stepIndex: 1
    },
    {
      title: "Activities & Leadership",
      description: "Build your extracurricular activity list",
      fields: ["10 Activities", "Positions Held", "Years Involved", "Descriptions (150 chars each)"],
      stepIndex: 2
    },
    {
      title: "Honors & Awards",
      description: "Highlight your achievements and recognition",
      fields: ["5 Awards/Honors", "Achievement Level", "Descriptions"],
      stepIndex: 3
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Find the next incomplete step
  const nextIncompleteStep = onboardingSteps.findIndex(step => !getStepCompletion(profile, step.stepIndex));
  const currentStep = nextIncompleteStep === -1 ? 0 : nextIncompleteStep;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-medium text-foreground tracking-tight">Profile Builder</h1>
          <p className="text-base text-muted-foreground">
            Let's build your comprehensive application profile step by step
          </p>
        </div>

        <Separator />

        {/* Progress Overview */}
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

        <Separator />

        {/* Onboarding Steps - Direct Content */}
        <div className="space-y-12">
          {onboardingSteps.map((step, index) => {
            const isCompleted = getStepCompletion(profile, step.stepIndex);
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep && !isCompleted;

            return (
              <div key={index} className="space-y-6">
                {/* Step Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                      isCompleted
                        ? 'bg-green-500/20 text-green-400'
                        : isCurrent
                          ? 'bg-primary/20 text-primary'
                          : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <span className="font-semibold text-lg">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                      <p className="text-lg text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  <Link to={`/profile/edit/${step.stepIndex}`}>
                    <Button
                      variant={isCurrent ? "default" : isCompleted ? "outline" : "ghost"}
                      className="rounded-xl"
                      disabled={isUpcoming}
                      size="lg"
                    >
                      {isCompleted ? "Review" : isCurrent ? "Continue" : "Start"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                {/* Step Fields */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pl-16">
                  {step.fields.map((field, fieldIndex) => (
                    <div
                      key={fieldIndex}
                      className="flex items-center space-x-3"
                    >
                      <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground font-medium">{field}</span>
                    </div>
                  ))}
                </div>

                {/* Separator between steps (except last) */}
                {index < onboardingSteps.length - 1 && (
                  <div className="pt-6">
                    <Separator />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
