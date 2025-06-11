
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface FullBreakdownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FullBreakdownModal = ({ open, onOpenChange }: FullBreakdownModalProps) => {
  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Standout': return 'bg-green-600 text-white';
      case 'Valuable': return 'bg-blue-600 text-white';
      case 'Common': return 'bg-gray-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const academicComponents = [
    { name: "GPA: 3.9/4.0", tag: "Standout" },
    { name: "SAT: 1520", tag: "Valuable" },
    { name: "AP Calculus BC: 5", tag: "Valuable" },
    { name: "AP Chemistry: 4", tag: "Common" }
  ];

  const extracurricularComponents = [
    { name: "Student Body President", tag: "Standout" },
    { name: "Varsity Tennis Captain", tag: "Valuable" },
    { name: "National Honor Society", tag: "Common" },
    { name: "Volunteer at Local Hospital", tag: "Valuable" }
  ];

  const personalityComponents = [
    { name: "Common App Essay", tag: "Valuable" },
    { name: "Leadership Experience Essay", tag: "Standout" },
    { name: "Why This Major Essay", tag: "Common" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium text-foreground">Profile Strength Breakdown</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overall" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-secondary">
            <TabsTrigger value="overall" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overall</TabsTrigger>
            <TabsTrigger value="academic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Academic</TabsTrigger>
            <TabsTrigger value="extracurricular" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Extracurricular</TabsTrigger>
            <TabsTrigger value="personality" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Personality</TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Your overall profile is evaluated holistically by admissions officers, combining academic achievement, 
              extracurricular involvement, and personal qualities. A strong overall profile demonstrates excellence 
              across multiple dimensions while showing genuine passion and commitment.
            </p>
            <Card className="ultra-card">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-foreground">Strengths</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Strong academic foundation</li>
                      <li>• Leadership experience</li>
                      <li>• Well-rounded profile</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-foreground">Areas for Growth</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Unique extracurricular achievements</li>
                      <li>• Specialized skills or talents</li>
                      <li>• Community impact projects</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Academic strength is evaluated through GPA, standardized test scores, course rigor, and academic achievements. 
              Admissions officers look for students who challenge themselves academically and demonstrate consistent performance.
            </p>
            <div className="space-y-3">
              {academicComponents.map((component, index) => (
                <Card key={index} className="ultra-card">
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="text-foreground">{component.name}</span>
                    <Badge className={getTagColor(component.tag)}>
                      {component.tag}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="extracurricular" className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Extracurricular activities demonstrate leadership, passion, and commitment outside the classroom. 
              Quality over quantity matters - admissions officers prefer deep involvement in fewer activities 
              rather than superficial participation in many.
            </p>
            <div className="space-y-3">
              {extracurricularComponents.map((component, index) => (
                <Card key={index} className="ultra-card">
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="text-foreground">{component.name}</span>
                    <Badge className={getTagColor(component.tag)}>
                      {component.tag}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="personality" className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Personality and character are assessed through essays, recommendations, and how you present yourself 
              throughout the application. Admissions officers want to understand who you are beyond grades and test scores.
            </p>
            <div className="space-y-3">
              {personalityComponents.map((component, index) => (
                <Card key={index} className="ultra-card">
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="text-foreground">{component.name}</span>
                    <Badge className={getTagColor(component.tag)}>
                      {component.tag}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FullBreakdownModal;
