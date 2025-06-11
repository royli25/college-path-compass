
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, Plus, Edit, ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FloatingAIAssistant from "@/components/ui/floating-ai-assistant";

interface Essay {
  id: string;
  school_name: string;
  prompt_name: string;
  word_limit: number | null;
  content: string;
  status: 'drafting' | 'in_review' | 'refining' | 'completed';
  deadline: string | null;
}

const Essays = () => {
  const [expandedSchool, setExpandedSchool] = useState<string | null>(null);
  const [editingEssay, setEditingEssay] = useState<Essay | null>(null);
  const [newPrompt, setNewPrompt] = useState({ name: "", wordLimit: "" });
  const [addingPromptTo, setAddingPromptTo] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: essays = [] } = useQuery({
    queryKey: ['essays'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('essays')
        .select('*')
        .order('school_name', { ascending: true });
      
      if (error) throw error;
      return data as Essay[];
    },
  });

  const updateEssayMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from('essays')
        .update({ content })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
    },
  });

  const addPromptMutation = useMutation({
    mutationFn: async ({ schoolName, promptName, wordLimit }: { schoolName: string; promptName: string; wordLimit?: number }) => {
      const { error } = await supabase
        .from('essays')
        .insert({
          school_name: schoolName,
          prompt_name: promptName,
          word_limit: wordLimit,
          content: '',
          status: 'drafting'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
      setNewPrompt({ name: "", wordLimit: "" });
      setAddingPromptTo(null);
    },
  });

  const schoolsData = essays.reduce((acc, essay) => {
    if (!acc[essay.school_name]) {
      acc[essay.school_name] = [];
    }
    acc[essay.school_name].push(essay);
    return acc;
  }, {} as Record<string, Essay[]>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white';
      case 'in_review': return 'bg-blue-600 text-white';
      case 'refining': return 'bg-yellow-600 text-white';
      case 'drafting': return 'bg-gray-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDeadlineText = (deadline: string | null) => {
    if (!deadline) return '';
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    return `${diffDays} days`;
  };

  const handleAddPrompt = (schoolName: string) => {
    if (newPrompt.name.trim()) {
      addPromptMutation.mutate({
        schoolName,
        promptName: newPrompt.name,
        wordLimit: newPrompt.wordLimit ? parseInt(newPrompt.wordLimit) : undefined
      });
    }
  };

  if (editingEssay) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Left side - Editor */}
          <div className="flex-1 p-8">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => setEditingEssay(null)}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Essays
              </Button>
              <h1 className="text-2xl font-medium text-foreground mb-2">
                {editingEssay.school_name} - {editingEssay.prompt_name}
              </h1>
              {editingEssay.word_limit && (
                <p className="text-muted-foreground">Word limit: {editingEssay.word_limit}</p>
              )}
            </div>

            <div className="mb-4 flex justify-end">
              <Button className="rounded-full">
                Send to Review
              </Button>
            </div>

            <textarea
              value={editingEssay.content}
              onChange={(e) => {
                setEditingEssay({ ...editingEssay, content: e.target.value });
                updateEssayMutation.mutate({ id: editingEssay.id, content: e.target.value });
              }}
              placeholder="Start writing your essay here..."
              className="w-full h-96 p-4 bg-card border border-border rounded-lg text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Right side - AI Assistant */}
          <FloatingAIAssistant 
            placeholder={editingEssay.content ? "Use this editor to ask AI questions and refine your essay logic. Please do not copy and paste content directly from the editor into your final essay." : "Use this editor to ask AI questions and refine your essay logic. Please do not copy and paste content directly from the editor into your final essay."}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-foreground mb-2">
            Essay Management
          </h1>
          <p className="text-muted-foreground">
            Manage your supplemental college essays in one place
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(schoolsData).map(([schoolName, schoolEssays]) => (
            <Card key={schoolName} className="ultra-card">
              <CardHeader>
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedSchool(expandedSchool === schoolName ? null : schoolName)}
                >
                  <div className="flex items-center space-x-4">
                    {expandedSchool === schoolName ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <CardTitle className="text-foreground">{schoolName}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-3">
                    {schoolEssays[0]?.deadline && (
                      <Badge className="bg-red-600 text-white rounded-full">
                        {new Date(schoolEssays[0].deadline).toLocaleDateString()} ({getDeadlineText(schoolEssays[0].deadline)})
                      </Badge>
                    )}
                    <Badge className="bg-blue-600 text-white rounded-full">
                      {schoolEssays.length} essay{schoolEssays.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              {expandedSchool === schoolName && (
                <CardContent className="space-y-4">
                  {schoolEssays.map((essay) => (
                    <div key={essay.id} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{essay.prompt_name}</h4>
                        {essay.word_limit && (
                          <p className="text-sm text-muted-foreground">Word limit: {essay.word_limit}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={`${getStatusColor(essay.status)} rounded-full`}>
                          {essay.status.charAt(0).toUpperCase() + essay.status.slice(1).replace('_', ' ')}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingEssay(essay)}
                          className="rounded-full"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}

                  {addingPromptTo === schoolName ? (
                    <div className="p-4 bg-secondary rounded-xl space-y-4">
                      <div>
                        <Label htmlFor="prompt-name">Prompt Name</Label>
                        <Input
                          id="prompt-name"
                          value={newPrompt.name}
                          onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
                          placeholder="Enter prompt name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="word-limit">Word Limit (optional)</Label>
                        <Input
                          id="word-limit"
                          type="number"
                          value={newPrompt.wordLimit}
                          onChange={(e) => setNewPrompt({ ...newPrompt, wordLimit: e.target.value })}
                          placeholder="Enter word limit"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleAddPrompt(schoolName)} className="rounded-full">
                          Add Prompt
                        </Button>
                        <Button variant="outline" onClick={() => setAddingPromptTo(null)} className="rounded-full">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setAddingPromptTo(schoolName)}
                      className="w-full rounded-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Essay Prompt
                    </Button>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Essays;
