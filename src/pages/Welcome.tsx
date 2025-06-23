import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, CheckCircle, Target, FileText, Calendar, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
const Welcome = () => {
  const features = [{
    icon: Target,
    title: "Smart School Matching",
    description: "Find schools that align with your interests and qualifications"
  }, {
    icon: FileText,
    title: "Profile Builder",
    description: "Create a comprehensive profile with activities, honors, and achievements"
  }, {
    icon: Calendar,
    title: "Deadline Tracking",
    description: "Never miss an important application deadline again"
  }, {
    icon: CheckCircle,
    title: "Progress Monitoring",
    description: "Track your application progress with visual indicators"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <img src="/myblueprint.png" alt="MyBlueprint Logo" className="h-24 w-auto block dark:hidden" />
            <img src="/myblueprint_dark.png" alt="MyBlueprint Logo" className="h-24 w-auto hidden dark:block" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Welcome
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Your all-in-one companion for college applications. Streamline your journey 
            from dream schools to acceptance letters with organized tools designed for 
            high school students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8 py-6" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 py-6" asChild>
              <Link to="/dashboard">View Demo</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
          const Icon = feature.icon;
          return <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>;
        })}
        </div>

        {/* Stats Section */}
        
      </div>
    </div>;
};
export default Welcome;