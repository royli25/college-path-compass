
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, CheckCircle, Target, FileText, Calendar, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MyBlueprint</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/welcome">Learn More</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <GraduationCap className="h-16 w-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Your College Application Journey Starts Here
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Streamline your path from dream schools to acceptance letters with 
            MyBlueprint - the all-in-one platform designed specifically for 
            high school students navigating college applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/auth">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/welcome">View Features</Link>
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
              Join thousands of students who are already using MyBlueprint to 
              organize their college applications and achieve their dreams.
            </p>
            <Button size="lg" asChild>
              <Link to="/auth">Create Your Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
