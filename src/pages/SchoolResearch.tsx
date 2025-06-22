import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FloatingAIAssistant from "@/components/ui/floating-ai-assistant";
import { useSchoolResearch } from "@/hooks/useSchoolResearch";
import { useUserSchools } from "@/hooks/useSchools";
import { ArrowLeft, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const SchoolResearch = () => {
  const { schoolId } = useParams();
  const { data: research, isLoading, updateResearch } = useSchoolResearch(schoolId);
  const [content, setContent] = useState(research?.content || "");
  const [isAiCollapsed, setIsAiCollapsed] = useState(false);

  // Fetch school information
  const { data: schools = [] } = useUserSchools();
  const school = schools.find(s => s.id === schoolId);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    updateResearch.mutate({ content: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="ultra-card">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-[600px] bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed AI Assistant */}
      <div 
        className={cn(
          "fixed right-0 top-0 bottom-0 z-30 hidden md:block transition-all duration-300",
          isAiCollapsed ? "w-16" : "w-80 lg:w-96 xl:w-[400px]"
        )}
      >
        <FloatingAIAssistant 
          isCollapsed={isAiCollapsed}
          onToggle={() => setIsAiCollapsed(!isAiCollapsed)}
        />
      </div>

      {/* Main Content Area with padding for AI assistant */}
      <div 
        className={cn(
          "transition-all duration-300 p-8",
          isAiCollapsed ? "pr-16" : "pr-0 md:pr-80 lg:pr-96 xl:pr-[400px]"
        )}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 space-y-4">
            <Link to="/schools">
              <Button variant="ghost" className="flex items-center gap-2 -ml-4">
                <ArrowLeft className="h-4 w-4" />
                Back to School List
              </Button>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Research Document
                </h1>
                {school && (
                  <p className="text-muted-foreground">
                    {school.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Card className="ultra-card">
            <CardContent className="p-6">
              <Textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Start your research notes here... You can include information about:
• Academic programs and majors
• Campus culture and student life
• Admission requirements and statistics
• Financial aid and scholarships
• Location and surrounding area
• Notable alumni and achievements
• Your personal impressions and thoughts"
                className="min-h-[600px] resize-none bg-background text-foreground border-0 focus-visible:ring-0"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SchoolResearch; 