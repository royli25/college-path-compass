
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import ProgressRing from "@/components/ui/progress-ring";
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Target, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const upcomingDeadlines = [
    { school: "Stanford University", type: "Early Action", date: "Nov 1, 2024", daysLeft: 15 },
    { school: "MIT", type: "Regular Decision", date: "Jan 1, 2025", daysLeft: 45 },
    { school: "UC Berkeley", type: "UC Application", date: "Nov 30, 2024", daysLeft: 44 },
  ];

  const recentActivity = [
    { action: "Completed Common App essay", time: "2 hours ago", type: "success" },
    { action: "Added Harvard to school list", time: "1 day ago", type: "info" },
    { action: "Updated activities section", time: "3 days ago", type: "success" },
  ];

  const quickStats = [
    { label: "Schools Added", value: "12", icon: BookOpen, color: "text-blue-600" },
    { label: "Essays Completed", value: "3/8", icon: FileText, color: "text-green-600" },
    { label: "Profile Progress", value: "75%", icon: Target, color: "text-purple-600" },
    { label: "Deadlines This Month", value: "4", icon: Calendar, color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Sarah! 👋
          </h1>
          <p className="text-muted-foreground">
            You're making great progress on your college applications. Keep it up!
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Application Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-2xl font-bold text-foreground">68% Complete</p>
                  <p className="text-muted-foreground">You're ahead of schedule!</p>
                </div>
                <ProgressRing progress={68} size={80} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                      <p className="font-semibold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-500" />
                <span>Upcoming Deadlines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground text-sm">{deadline.school}</p>
                    <p className="text-xs text-muted-foreground">{deadline.type}</p>
                    <p className="text-xs text-muted-foreground">{deadline.date}</p>
                  </div>
                  <Badge variant={deadline.daysLeft <= 20 ? "destructive" : "secondary"}>
                    {deadline.daysLeft}d
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button asChild className="h-20 flex-col space-y-2">
            <Link to="/schools">
              <BookOpen className="h-6 w-6" />
              <span>Manage Schools</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col space-y-2">
            <Link to="/profile">
              <Target className="h-6 w-6" />
              <span>Update Profile</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col space-y-2">
            <Link to="/essays">
              <FileText className="h-6 w-6" />
              <span>Write Essays</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20 flex-col space-y-2">
            <Link to="/deadlines">
              <Calendar className="h-6 w-6" />
              <span>View Calendar</span>
            </Link>
          </Button>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {activity.type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-primary" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
