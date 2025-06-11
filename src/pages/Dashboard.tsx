
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RatingCard from "@/components/ui/rating-card";
import ChatInterface from "@/components/ui/chat-interface";
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Target, 
  TrendingUp, 
  ExternalLink,
  Zap,
  Shield,
  Heart,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const profileStrengths = [
    {
      title: "Overall Rating",
      score: 75,
      description: "Strong foundation with room for growth"
    },
    {
      title: "Academic Strength",
      score: 85,
      description: "Excellent GPA and test scores"
    },
    {
      title: "Extracurricular Strength",
      score: 65,
      description: "Good activities, need leadership"
    },
    {
      title: "Personality Strength",
      score: 70,
      description: "Essays show potential"
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
      icon: List,
      title: "Major Explorer",
      description: "Discover programs that match your interests",
      href: "/majors",
      color: "text-purple-400"
    },
    {
      icon: FileText,
      title: "Essay Management",
      description: "Track and organize your application essays",
      href: "/essays",
      color: "text-orange-400"
    },
    {
      icon: Calendar,
      title: "Deadline Tracker",
      description: "Never miss an important application deadline",
      href: "/deadlines",
      color: "text-red-400"
    },
    {
      icon: TrendingUp,
      title: "Analytics",
      description: "Track your application progress and insights",
      href: "/dashboard",
      color: "text-indigo-400"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-medium text-foreground tracking-tight">
            Welcome back, Sarah! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            You're making excellent progress on your college applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Strength & Features */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Strength Overview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-medium text-foreground">Profile Strength</h2>
                <Button variant="outline" className="rounded-xl">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Full Breakdown
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Right Column - Chat Interface */}
          <div className="lg:col-span-1">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
