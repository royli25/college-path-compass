import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RatingCard from "@/components/ui/rating-card";
import NotificationsDropdown from "@/components/ui/notifications-dropdown";
import FloatingAIAssistant from "@/components/ui/floating-ai-assistant";
import FullBreakdownModal from "@/components/ui/full-breakdown-modal";
import ProfileCompletionAlert from "@/components/ProfileCompletionAlert";
import { BookOpen, Calendar, FileText, Target, TrendingUp, ExternalLink, Zap, Shield, Heart, Users, User, List } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useProfileStrength, useProfileData } from "@/hooks/useProfileData";

const Dashboard = () => {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const { strength, isComplete, isLoading } = useProfileStrength();
  const { data: profile } = useProfileData();

  const profileStrengths = [
    {
      title: "Overall Rating",
      score: strength.overall,
      description: isComplete ? "Strong foundation with room for growth" : "Complete your profile to improve this score"
    },
    {
      title: "Academic Strength", 
      score: strength.academic,
      description: isComplete ? "Excellent GPA and test scores" : "Add academic information to your profile"
    },
    {
      title: "Extracurricular Strength",
      score: strength.extracurricular,
      description: isComplete ? "Good activities, need leadership" : "Add extracurricular activities to your profile"
    },
    {
      title: "Personality Strength",
      score: strength.personality,
      description: isComplete ? "Essays show potential" : "Complete your profile to showcase personality"
    }
  ];

  const features = [
    {
      icon: User,
      title: "Profile Builder",
      description: "Build a comprehensive academic and personal profile",
      href: "/profile",
      color: "text-blue-400"
    },
    {
      icon: BookOpen,
      title: "School List",
      description: "Research and organize your target schools",
      href: "/schools",
      color: "text-green-400"
    },
    {
      icon: FileText,
      title: "Essay Management",
      description: "Track and organize your application essays",
      href: "/essays",
      color: "text-orange-400"
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description: "Track your application progress and insights",
      href: "/dashboard",
      color: "text-indigo-400"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Notifications */}
      <div className="flex justify-between items-center p-8 pb-0">
        <div></div>
        <NotificationsDropdown />
      </div>

      <div className="p-8 pt-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-medium text-foreground tracking-tight">
              {`Welcome back${profile?.full_name ? ", " + profile.full_name : ""}!`}
            </h1>
            <p className="text-lg text-muted-foreground">
              You're making excellent progress on your college applications.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Profile Strength & Features */}
            <div className="space-y-8">
              {/* Profile Completion Alert */}
              <ProfileCompletionAlert completionPercentage={strength.overall} />

              {/* Profile Strength Overview */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-medium text-foreground">Profile Strength</h2>
                  <Button variant="outline" className="rounded-xl" onClick={() => setIsBreakdownOpen(true)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Full Breakdown
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-0">
                  {profileStrengths.map((strength, index) => (
                    <RatingCard 
                      key={index} 
                      title={strength.title} 
                      score={strength.score} 
                      description={strength.description} 
                    />
                  ))}
                </div>
              </div>

              {/* Features Overview */}
              <div className="space-y-6">
                <h2 className="text-2xl font-medium text-foreground">Platform Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <Card key={index} className="ultra-card smooth-hover group">
                        <CardContent className="p-6">
                          <Link to={feature.href} className="block space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-xl bg-secondary/50 ${feature.color} group-hover:scale-110 transition-transform duration-200`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <h3 className="font-medium text-foreground">{feature.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {feature.description}
                            </p>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - AI Assistant fills this space */}
            <div className="h-full w-full"><FloatingAIAssistant /></div>
          </div>
        </div>
      </div>

      {/* Full Breakdown Modal */}
      <FullBreakdownModal open={isBreakdownOpen} onOpenChange={setIsBreakdownOpen} />
    </div>
  );
};

export default Dashboard;
