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

interface UserSchool {
  id: string;
  name: string;
  location: string | null;
  type: string | null;
  deadline: string | null;
}

interface Essay {
  id: string;
  school_id: string | null;
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

  const { data: schools = [] } = useQuery({
    queryKey: ['user-schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_school_lists')
        .select('id, name, location, type, deadline')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as UserSchool[];
    },
  });

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
    mutationFn: async ({ schoolId, schoolName, promptName, wordLimit }: { 
      schoolId: string; 
      schoolName: string; 
      promptName: string; 
      wordLimit?: number 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('essays')
        .insert({
          school_id: schoolId,
          school_name: schoolName,
          prompt_name: promptName,
          word_limit: wordLimit,
          content: '',
          status: 'drafting',
          user_id: user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
      setNewPrompt({ name: "", wordLimit: "" });
      setAddingPromptTo(null);
    },
  });

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

  const handleAddPrompt = (school: UserSchool) => {
    if (newPrompt.name.trim()) {
      addPromptMutation.mutate({
        schoolId: school.id,
        schoolName: school.name,
        promptName: newPrompt.name,
        wordLimit: newPrompt.wordLimit ? parseInt(newPrompt.wordLimit) : undefined
      });
    }
  };

  const getEssaysForSchool = (schoolId: string) => {
    return essays.filter(essay => essay.school_id === schoolId);
  };

  if (editingEssay) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex gap-6">
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
          <div className="w-[350px] max-w-sm min-w-[300px] h-full pt-8 pr-8">
            <FloatingAIAssistant 
              placeholder={editingEssay.content ? "Use this editor to ask AI questions and refine your essay logic. Please do not copy and paste content directly from the editor into your final essay." : "Use this editor to ask AI questions and refine your essay logic. Please do not copy and paste content directly from the editor into your final essay."}
            />
          </div>
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
          {schools.map((school) => {
            const schoolEssays = getEssaysForSchool(school.id);
            return (
              <Card key={school.id} className="ultra-card">
                <CardHeader>
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedSchool(expandedSchool === school.id ? null : school.id)}
                  >
                    <div className="flex items-center space-x-4">
                      {expandedSchool === school.id ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <CardTitle className="text-foreground">{school.name}</CardTitle>
                        {school.location && (
                          <p className="text-sm text-muted-foreground">{school.location}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {school.deadline && (
                        <Badge className="bg-red-600 text-white rounded-full">
                          {new Date(school.deadline).toLocaleDateString()} ({getDeadlineText(school.deadline)})
                        </Badge>
                      )}
                      {school.type && (
                        <Badge variant="outline" className="rounded-full capitalize">
                          {school.type}
                        </Badge>
                      )}
                      <Badge className="bg-blue-600 text-white rounded-full">
                        {schoolEssays.length} essay{schoolEssays.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {expandedSchool === school.id && (
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

                    {addingPromptTo === school.id ? (
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
                          <Button onClick={() => handleAddPrompt(school)} className="rounded-full">
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
                        onClick={() => setAddingPromptTo(school.id)}
                        className="w-full rounded-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Essay Prompt
                      </Button>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}

          {schools.length === 0 && (
            <Card className="ultra-card text-center py-12">
              <CardContent>
                <div className="text-muted-foreground mb-4">
                  <p className="text-lg">No schools found in your list.</p>
                  <p className="text-sm">Add schools to your list to start managing essays.</p>
                </div>
                <Button className="rounded-xl">Go to School List</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Essays;
