
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, PlusIcon, BookOpen, Clock, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import FloatingAIAssistant from "@/components/ui/floating-ai-assistant";
import { format } from "date-fns";

interface Essay {
  id: string;
  school_name: string;
  prompt_name: string;
  content: string | null;
  word_limit: number | null;
  deadline: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const statusColors = {
  'drafting': 'bg-yellow-100 text-yellow-800',
  'reviewing': 'bg-blue-100 text-blue-800',
  'complete': 'bg-green-100 text-green-800',
  'submitted': 'bg-purple-100 text-purple-800'
};

const statusIcons = {
  'drafting': Clock,
  'reviewing': AlertCircle,
  'complete': CheckCircle,
  'submitted': CheckCircle
};

const Essays = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEssay, setNewEssay] = useState({
    school_name: '',
    prompt_name: '',
    word_limit: '',
    deadline: ''
  });

  // Fetch essays
  const { data: essays = [], isLoading } = useQuery({
    queryKey: ['essays', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('essays')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Essay[];
    },
    enabled: !!user,
  });

  // Add essay mutation
  const addEssayMutation = useMutation({
    mutationFn: async (essay: typeof newEssay) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('essays')
        .insert({
          ...essay,
          word_limit: essay.word_limit ? parseInt(essay.word_limit) : null,
          deadline: essay.deadline || null,
          user_id: user.id,
          status: 'drafting',
          content: ''
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
      setShowAddForm(false);
      setNewEssay({ school_name: '', prompt_name: '', word_limit: '', deadline: '' });
      toast.success('Essay added successfully!');
    },
    onError: (error) => {
      toast.error('Failed to add essay: ' + error.message);
    }
  });

  // Update essay mutation
  const updateEssayMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Essay> }) => {
      const { data, error } = await supabase
        .from('essays')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
      toast.success('Essay updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update essay: ' + error.message);
    }
  });

  // Delete essay mutation
  const deleteEssayMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('essays')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
      setSelectedEssay(null);
      toast.success('Essay deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete essay: ' + error.message);
    }
  });

  const handleAddEssay = () => {
    if (!newEssay.school_name || !newEssay.prompt_name) {
      toast.error('Please fill in required fields');
      return;
    }
    addEssayMutation.mutate(newEssay);
  };

  const handleUpdateContent = (content: string) => {
    if (!selectedEssay) return;
    updateEssayMutation.mutate({
      id: selectedEssay.id,
      updates: { content }
    });
  };

  const handleUpdateStatus = (status: string) => {
    if (!selectedEssay) return;
    updateEssayMutation.mutate({
      id: selectedEssay.id,
      updates: { status }
    });
  };

  const getWordCount = (text: string | null) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-96 bg-muted rounded"></div>
              <div className="lg:col-span-2 h-96 bg-muted rounded"></div>
            </div>
          </div>
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Essays</h1>
            <p className="text-muted-foreground">
              Manage your college application essays and track your progress
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Essays List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Essays</h2>
                <Button
                  onClick={() => setShowAddForm(true)}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Essay
                </Button>
              </div>

              {showAddForm && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Add New Essay</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="school_name">School Name *</Label>
                      <Input
                        id="school_name"
                        value={newEssay.school_name}
                        onChange={(e) => setNewEssay({ ...newEssay, school_name: e.target.value })}
                        placeholder="e.g., Harvard University"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prompt_name">Essay Prompt *</Label>
                      <Input
                        id="prompt_name"
                        value={newEssay.prompt_name}
                        onChange={(e) => setNewEssay({ ...newEssay, prompt_name: e.target.value })}
                        placeholder="e.g., Personal Statement"
                      />
                    </div>
                    <div>
                      <Label htmlFor="word_limit">Word Limit</Label>
                      <Input
                        id="word_limit"
                        type="number"
                        value={newEssay.word_limit}
                        onChange={(e) => setNewEssay({ ...newEssay, word_limit: e.target.value })}
                        placeholder="e.g., 650"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newEssay.deadline}
                        onChange={(e) => setNewEssay({ ...newEssay, deadline: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddEssay} disabled={addEssayMutation.isPending}>
                        Add Essay
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {essays.map((essay) => {
                  const StatusIcon = statusIcons[essay.status as keyof typeof statusIcons] || Clock;
                  const wordCount = getWordCount(essay.content);
                  
                  return (
                    <Card
                      key={essay.id}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedEssay?.id === essay.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedEssay(essay)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-medium text-sm mb-1">{essay.school_name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{essay.prompt_name}</p>
                          </div>
                          <Badge
                            className={`text-xs ${statusColors[essay.status as keyof typeof statusColors]}`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {essay.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {wordCount} {essay.word_limit && `/ ${essay.word_limit}`} words
                          </span>
                          {essay.deadline && (
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {format(new Date(essay.deadline), 'MMM dd')}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {essays.length === 0 && !showAddForm && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No essays yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start by adding your first college essay
                      </p>
                      <Button onClick={() => setShowAddForm(true)}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Essay
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Essay Editor */}
            <div className="lg:col-span-2">
              {selectedEssay ? (
                <Card className="h-full">
                  <CardHeader className="border-b">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{selectedEssay.school_name}</CardTitle>
                        <p className="text-muted-foreground mt-1">{selectedEssay.prompt_name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={selectedEssay.status || 'drafting'}
                          onValueChange={handleUpdateStatus}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="drafting">Drafting</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteEssayMutation.mutate(selectedEssay.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span>
                        Words: {getWordCount(selectedEssay.content)}
                        {selectedEssay.word_limit && ` / ${selectedEssay.word_limit}`}
                      </span>
                      {selectedEssay.deadline && (
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          Due: {format(new Date(selectedEssay.deadline), 'PPP')}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-0 flex-1">
                    <Textarea
                      value={selectedEssay.content || ''}
                      onChange={(e) => {
                        setSelectedEssay({ ...selectedEssay, content: e.target.value });
                        // Debounced save would go here
                        const timeoutId = setTimeout(() => {
                          handleUpdateContent(e.target.value);
                        }, 1000);
                        return () => clearTimeout(timeoutId);
                      }}
                      placeholder="Start writing your essay here..."
                      className="min-h-[600px] resize-none border-0 focus-visible:ring-0 rounded-none"
                    />
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full">
                  <CardContent className="p-8 text-center flex items-center justify-center h-full">
                    <div>
                      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">Select an essay to edit</h3>
                      <p className="text-muted-foreground">
                        Choose an essay from the list to start writing or editing
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Essays;
