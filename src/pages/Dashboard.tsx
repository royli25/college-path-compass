import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RatingCard from "@/components/ui/rating-card";
import FloatingAIAssistant from "@/components/ui/floating-ai-assistant";
import FullBreakdownModal from "@/components/ui/full-breakdown-modal";
import ProfileCompletionAlert from "@/components/ProfileCompletionAlert";
import { BookOpen, Calendar, FileText, Target, TrendingUp, ExternalLink, Zap, Shield, Heart, Users, User, List, UserCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useProfileStrength, useProfileData } from "@/hooks/useProfileData";
import { useAuth } from "@/contexts/AuthContext";
import { useAdvisor } from "@/hooks/useAdvisor";
import { Badge } from "@/components/ui/badge";
import ToDoLog from "@/components/ToDoLog";

const Dashboard = () => {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isAiCollapsed, setIsAiCollapsed] = useState(false);
  const { strength, isComplete, isLoading } = useProfileStrength();
  const { data: profile } = useProfileData();
  const { userRole } = useAuth();
  const { useStudentAdvisor } = useAdvisor();
  const { data: advisorRelationship } = useStudentAdvisor();
  const navigate = useNavigate();

  // Redirect advisors to their dashboard
  useEffect(() => {
    if (!isLoading && userRole === 'advisor') {
      navigate('/advisor/dashboard', { replace: true });
    }
  }, [userRole, isLoading, navigate]);

  // Don't render student dashboard for advisors
  if (userRole === 'advisor') {
    return null;
  }

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
      color: "text-primary"
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
      <div className="min-h-screen bg-background">
        {/* Fixed AI Assistant */}
        <div className="fixed right-0 top-0 bottom-0 w-80 lg:w-96 xl:w-[400px] z-30 hidden md:block">
          <FloatingAIAssistant isCollapsed={false} onToggle={() => {}} />
        </div>
        
        {/* Main Content with right padding to account for fixed AI assistant */}
        <div className="pr-0 md:pr-80 lg:pr-96 xl:pr-[400px] p-8">
          <div className="max-w-4xl mx-auto">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed AI Assistant - Hidden on mobile, responsive width on larger screens */}
      <div 
        className={`fixed right-0 top-0 bottom-0 z-30 hidden md:block transition-all duration-300 p-4 ${
          isAiCollapsed ? "w-24" : "w-80 lg:w-96 xl:w-[400px]"
        }`}
      >
        <FloatingAIAssistant 
          isCollapsed={isAiCollapsed} 
          onToggle={() => setIsAiCollapsed(!isAiCollapsed)} 
        />
      </div>

      <div 
        className={`transition-all duration-300 p-8 ${
          isAiCollapsed ? "pr-16" : "pr-0 md:pr-80 lg:pr-96 xl:pr-[400px]"
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-medium text-foreground tracking-tight">
              {`Welcome back${profile?.full_name ? ", " + profile.full_name : ""}`}
            </h1>
            <p className="text-base text-muted-foreground">
              You're making excellent progress on your college applications.
            </p>
          </div>

          {/* Profile Completion Alert */}
          <ProfileCompletionAlert completionPercentage={strength.overall} />

          <ToDoLog />

          {/* Features Overview */}
          <div className="space-y-6">
            <h2 className="text-xl font-medium text-foreground">Platform Features</h2>
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

          {/* Mobile AI Assistant - Show only on mobile as a card */}
          <div className="block md:hidden">
            <Card className="ultra-card">
              <CardHeader>
                <CardTitle className="text-lg font-medium">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Get personalized advice for your college applications. Available on larger screens.
                </p>
                <Button variant="outline" className="w-full">
                  View on Desktop
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Full Breakdown Modal */}
      {isBreakdownOpen && (
        <FullBreakdownModal 
          open={isBreakdownOpen}
          onOpenChange={setIsBreakdownOpen}
          strength={strength}
        />
      )}
    </div>
  );
};

export default Dashboard;
