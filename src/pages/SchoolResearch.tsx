import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import FloatingAIAssistant from "@/components/ui/floating-ai-assistant";
import { useSchoolResearch } from "@/hooks/useSchoolResearch";

const SchoolResearch = () => {
  const { schoolId } = useParams();
  const { data: research, isLoading, updateResearch } = useSchoolResearch(schoolId);
  const [content, setContent] = useState(research?.content || "");

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
      <div className="fixed right-0 top-0 bottom-0 w-80 lg:w-96 xl:w-[400px] z-30 hidden md:block">
        <FloatingAIAssistant />
      </div>

      {/* Main Content Area with padding for AI assistant */}
      <div className="pr-0 md:pr-80 lg:pr-96 xl:pr-[400px] p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="ultra-card">
            <CardContent className="p-6">
              <Textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Start your research notes here..."
                className="min-h-[600px] resize-none bg-background text-foreground"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SchoolResearch; 