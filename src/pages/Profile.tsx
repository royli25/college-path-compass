
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-medium text-foreground tracking-tight">Profile Builder</h1>
          <p className="text-lg text-muted-foreground">
            Let's build your comprehensive application profile step by step
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="ultra-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-foreground">Overall Progress</h2>
                <span className="text-2xl font-semibold text-primary">{strength.overall}%</span>
              </div>
              <Progress value={strength.overall} className="h-3 rounded-full" />
              <p className="text-sm text-muted-foreground">
                Complete all sections to build a strong application profile
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Steps */}
        <div className="space-y-6">
          {onboardingSteps.map((step, index) => {
            const isCompleted = getStepCompletion(profile, step.stepIndex);
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep && !isCompleted;

            return (
              <Card 
                key={index} 
                className={`ultra-card smooth-hover transition-all duration-300 ${
                  isCurrent ? 'ring-2 ring-primary shadow-xl shadow-primary/10' : ''
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                        isCompleted 
                          ? 'bg-green-500/20 text-green-400' 
                          : isCurrent 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl text-foreground">{step.title}</CardTitle>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <Link to={`/profile/edit/${step.stepIndex}`}>
                      <Button 
                        variant={isCurrent ? "default" : isCompleted ? "outline" : "ghost"}
                        className="rounded-xl"
                        disabled={isUpcoming}
                      >
                        {isCompleted ? "Review" : isCurrent ? "Continue" : "Start"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {step.fields.map((field, fieldIndex) => (
                      <div 
                        key={fieldIndex}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <Circle className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{field}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Get Started CTA */}
        <Card className="ultra-card text-center">
          <CardContent className="p-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-foreground">Ready to Get Started?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Building a complete profile typically takes 30-45 minutes. You can save your progress and return anytime.
              </p>
              <Link to={`/profile/edit/${currentStep}`}>
                <Button 
                  size="lg" 
                  className="rounded-xl bg-primary hover:bg-primary/90"
                >
                  {strength.overall > 0 ? "Continue Building My Profile" : "Start Building My Profile"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
