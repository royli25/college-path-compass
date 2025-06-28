import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, CheckCircle, Target, FileText, Calendar, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Target,
      title: "Smart School Matching",
      description: "Find schools that align with your interests and qualifications"
    },
    {
      icon: FileText,
      title: "Profile Builder",
      description: "Create a comprehensive profile with activities, honors, and achievements"
    },
    {
      icon: Calendar,
      title: "Deadline Tracking",
      description: "Never miss an important application deadline again"
    },
    {
      icon: CheckCircle,
      title: "Progress Monitoring",
      description: "Track your application progress with visual indicators"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Announcement Banner */}
      <div className="bg-black text-white p-2 text-center text-sm">
        <div className="container mx-auto flex items-center justify-center space-x-4">
          <span className="bg-white text-black font-bold text-xs px-3 py-1 rounded-full">
            New
          </span>
          <span>Full Product Launching September 2025</span>
          <Link to="/auth" className="flex items-center space-x-2 hover:underline">
            <span>Join Waitlist</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-background via-muted/20 to-background">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/myblueprint.png" alt="MyBlueprint Logo" className="h-8 w-auto block dark:hidden" />
              <img src="/myblueprint_dark.png" alt="MyBlueprint Logo" className="h-8 w-auto hidden dark:block" />
            </Link>
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link to="/auth">Try Demo</Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="flex justify-center mb-4">
              <img src="/myblueprint.png" alt="MyBlueprint Logo" className="h-24 w-auto block dark:hidden" />
              <img src="/myblueprint_dark.png" alt="MyBlueprint Logo" className="h-24 w-auto hidden dark:block" />
            </div>
            <h1 className="text-5xl font-semibold text-foreground mb-8 font-sf-pro">
              Centralize Your College Application Workflow Today.
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 shadow-[0_4px_0_0_rgba(0,0,0,0.25)] active:translate-y-0.5 active:shadow-none transition-all"
                asChild
              >
                <Link to="/auth">
                  Get Started
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-primary/5 rounded-2xl p-8 border">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of students who are already using this platform to
                organize their college applications and achieve their dreams.
              </p>
              <Button size="lg" asChild>
                <Link to="/auth">Create Your Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
