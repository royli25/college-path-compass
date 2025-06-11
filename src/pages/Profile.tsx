
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/layout/Navbar";
import ProgressRing from "@/components/ui/progress-ring";
import { User, GraduationCap, Award, Plus, Save } from "lucide-react";

const Profile = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      activity: "Debate Team",
      position: "Captain",
      years: "10, 11, 12",
      description: "Led team to state championships, managed 20+ members"
    }
  ]);

  const [honors, setHonors] = useState([
    {
      id: 1,
      title: "National Merit Semifinalist",
      level: "National",
      description: "Top 1% of PSAT scorers nationwide"
    }
  ]);

  const addActivity = () => {
    setActivities([...activities, {
      id: Date.now(),
      activity: "",
      position: "",
      years: "",
      description: ""
    }]);
  };

  const addHonor = () => {
    setHonors([...honors, {
      id: Date.now(),
      title: "",
      level: "",
      description: ""
    }]);
  };

  const profileCompletion = 75;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Student Profile</h1>
            <p className="text-muted-foreground">
              Build your comprehensive application profile
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <ProgressRing progress={profileCompletion} size={60} />
              <p className="text-sm text-muted-foreground mt-2">Complete</p>
            </div>
            <Button className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible defaultValue="basic-info" className="space-y-4">
              {/* Basic Information */}
              <AccordionItem value="basic-info">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Basic Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="Sarah" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Johnson" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue="sarah.johnson@email.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="school">High School</Label>
                          <Input id="school" defaultValue="Lincoln High School" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="graduationYear">Graduation Year</Label>
                          <Input id="graduationYear" defaultValue="2024" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gpa">GPA</Label>
                          <Input id="gpa" defaultValue="3.85" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="satScore">SAT Score</Label>
                          <Input id="satScore" defaultValue="1520" />
                        </div>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* Activities */}
              <AccordionItem value="activities">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Activities ({activities.length}/10)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0 space-y-6">
                      {activities.map((activity, index) => (
                        <div key={activity.id} className="p-4 border rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Activity #{index + 1}</h4>
                            <Button variant="outline" size="sm">Remove</Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Activity/Organization</Label>
                              <Input defaultValue={activity.activity} placeholder="e.g., Debate Team" />
                            </div>
                            <div className="space-y-2">
                              <Label>Position/Role</Label>
                              <Input defaultValue={activity.position} placeholder="e.g., Captain" />
                            </div>
                            <div className="space-y-2">
                              <Label>Years Participated</Label>
                              <Input defaultValue={activity.years} placeholder="e.g., 10, 11, 12" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description (150 characters)</Label>
                            <Textarea
                              defaultValue={activity.description}
                              placeholder="Describe your role and achievements..."
                              maxLength={150}
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                      {activities.length < 10 && (
                        <Button variant="outline" onClick={addActivity} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Activity
                        </Button>
                      )}
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* Honors & Awards */}
              <AccordionItem value="honors">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="font-semibold">Honors & Awards ({honors.length}/5)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0 space-y-6">
                      {honors.map((honor, index) => (
                        <div key={honor.id} className="p-4 border rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Honor #{index + 1}</h4>
                            <Button variant="outline" size="sm">Remove</Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Honor/Award Title</Label>
                              <Input defaultValue={honor.title} placeholder="e.g., National Merit Semifinalist" />
                            </div>
                            <div className="space-y-2">
                              <Label>Level</Label>
                              <Input defaultValue={honor.level} placeholder="e.g., National, State, School" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              defaultValue={honor.description}
                              placeholder="Describe the achievement..."
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                      {honors.length < 5 && (
                        <Button variant="outline" onClick={addHonor} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Honor/Award
                        </Button>
                      )}
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Progress Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Basic Information</span>
                    <span className="text-sm font-medium text-success">100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Activities</span>
                    <span className="text-sm font-medium text-warning">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Honors & Awards</span>
                    <span className="text-sm font-medium text-warning">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Essays</span>
                    <span className="text-sm font-medium text-muted-foreground">0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Use specific numbers and achievements in your descriptions</p>
                  <p>• Show leadership and impact in your activities</p>
                  <p>• Keep descriptions concise but impactful</p>
                  <p>• Update your profile regularly</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
