import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, PlusIcon, BookOpen, Clock, CheckCircle, AlertCircle, Trash2, ChevronDown, ChevronRight, Edit, Save, ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import FloatingAIAssistant from "@/components/ui/floating-ai-assistant";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useUserSchools } from "@/hooks/useSchools";
import { Link } from "react-router-dom";

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
  const [expandedSchools, setExpandedSchools] = useState<Set<string>>(new Set());
  const [editingEssay, setEditingEssay] = useState<Essay | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [showAddFormForSchool, setShowAddFormForSchool] = useState<string | null>(null);
  const [isAiCollapsed, setIsAiCollapsed] = useState(false);
  const [newEssay, setNewEssay] = useState({
    prompt_name: '',
    word_limit: '',
    deadline: ''
  });

  // Fetch essays
  const { data: essays = [], isLoading: isLoadingEssays } = useQuery({
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

  // Fetch schools
  const { data: userSchools = [], isLoading: isLoadingSchools } = useUserSchools();

  // Group essays by school
  const essaysBySchool = essays.reduce((acc, essay) => {
    if (!acc[essay.school_name]) {
      acc[essay.school_name] = [];
    }
    acc[essay.school_name].push(essay);
    return acc;
  }, {} as Record<string, Essay[]>);

  // Combine user's school list with schools that already have essays
  const allSchoolNames = Array.from(new Set([...userSchools.map(s => s.name), ...Object.keys(essaysBySchool)]));

  // Filter to only show schools that are in the user's current school list
  const userSchoolNames = userSchools.map(s => s.name);
  const filteredSchoolNames = allSchoolNames.filter(schoolName => userSchoolNames.includes(schoolName));

  // Add essay mutation
  const addEssayMutation = useMutation({
    mutationFn: async (essay: Omit<typeof newEssay, 'school_name'> & { school_name: string }) => {
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
      setShowAddFormForSchool(null);
      setNewEssay({ prompt_name: '', word_limit: '', deadline: '' });
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
      setEditingEssay(null);
      toast.success('Essay deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete essay: ' + error.message);
    }
  });

  useEffect(() => {
    if (editingEssay) {
      setEditorContent(editingEssay.content || "");
    }
  }, [editingEssay]);

  const handleAddEssay = (schoolName: string) => {
    if (!newEssay.prompt_name) {
      toast.error('Please fill in the essay prompt');
      return;
    }
    addEssayMutation.mutate({ ...newEssay, school_name: schoolName });
  };

  const handleSaveEssay = () => {
    if (editingEssay) {
      updateEssayMutation.mutate({
        id: editingEssay.id,
        updates: { content: editorContent }
      });
    }
  };

  const handleUpdateStatus = (status: string) => {
    if (!editingEssay) return;
    updateEssayMutation.mutate({
      id: editingEssay.id,
      updates: { status }
    });
  };

  const getWordCount = (text: string | null) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const toggleSchoolExpansion = (schoolName: string) => {
    const newExpanded = new Set(expandedSchools);
    if (newExpanded.has(schoolName)) {
      newExpanded.delete(schoolName);
    } else {
      newExpanded.add(schoolName);
    }
    setExpandedSchools(newExpanded);
  };

  const isLoading = isLoadingEssays || isLoadingSchools;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Essay Editor View
  if (editingEssay) {
    return (
      <div className="min-h-screen bg-muted/50">
        {/* Fixed AI Assistant - Only show on editor screen */}
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

        <div 
          className={cn(
            "transition-all duration-300 p-8",
            isAiCollapsed ? "pr-16" : "pr-0 md:pr-80 lg:pr-96 xl:pr-[400px]"
          )}
        >
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="space-y-4 mb-6">
              <Button
                variant="ghost"
                onClick={() => setEditingEssay(null)}
                className="flex items-center gap-2 self-start -ml-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Essays
              </Button>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{editingEssay.school_name}</h1>
                  <p className="text-muted-foreground">{editingEssay.prompt_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={editingEssay.status || 'drafting'}
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
                  <Button onClick={handleSaveEssay} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
            </div>

            {/* Essay Info */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>
                Words: {getWordCount(editorContent)}
                {editingEssay.word_limit && ` / ${editingEssay.word_limit}`}
              </span>
              {editingEssay.deadline && (
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  Due: {format(new Date(editingEssay.deadline), 'PPP')}
                </span>
              )}
            </div>

            {/* Editor */}
            <Textarea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              placeholder="Start writing your essay here..."
              className="min-h-[600px] w-full rounded-lg border border-input bg-white p-6 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </div>
    );
  }

  // Main Essays Dashboard View
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content Area - No AI assistant on dashboard */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Essays</h1>
            <p className="text-muted-foreground">
              Manage your college application essays and track your progress
            </p>
          </div>

          <div className="space-y-6">
            {/* Schools List */}
            {filteredSchoolNames.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Schools</h2>
                <div className="space-y-2">
                  {filteredSchoolNames.map((school) => {
                    const schoolEssays = essaysBySchool[school] || [];
                    const isExpanded = expandedSchools.has(school);
                    
                    return (
                      <div key={school} className="space-y-2">
                        {/* School Bar */}
                        <Card 
                          className="cursor-pointer hover:bg-muted/50 transition-all duration-200"
                          onClick={() => toggleSchoolExpansion(school)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {isExpanded ? (
                                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                )}
                                <div>
                                  <h3 className="font-medium text-lg">{school}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {schoolEssays.length} essay{schoolEssays.length !== 1 ? 's' : ''} required
                                  </p>
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-sm">
                                {schoolEssays.length} Essays
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Essays Dropdown */}
                        {isExpanded && (
                          <div className="ml-8 space-y-2 animate-in slide-in-from-top-2 duration-200">
                            {schoolEssays.map((essay) => {
                              const StatusIcon = statusIcons[essay.status as keyof typeof statusIcons] || Clock;
                              const wordCount = getWordCount(essay.content);
                              
                              return (
                                <Card key={essay.id} className="border-l-4 border-l-primary/20">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <h4 className="font-medium text-sm mb-1">{essay.prompt_name}</h4>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge className={`text-xs ${statusColors[essay.status as keyof typeof statusColors]}`}>
                                          <StatusIcon className="h-3 w-3 mr-1" />
                                          {essay.status}
                                        </Badge>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingEssay(essay);
                                          }}
                                          className="flex items-center gap-1"
                                        >
                                          <Edit className="h-3 w-3" />
                                          Edit
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}

                            {/* Add Essay Form within school section */}
                            {showAddFormForSchool === school ? (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-sm">Add New Essay for {school}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
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
                                    <Button onClick={() => handleAddEssay(school)} disabled={addEssayMutation.isPending}>
                                      Add Essay
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => setShowAddFormForSchool(null)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ) : (
                              <Button
                                onClick={() => setShowAddFormForSchool(school)}
                                size="sm"
                                variant="ghost"
                                className="flex items-center gap-2"
                              >
                                <PlusIcon className="h-4 w-4" />
                                Add Essay Prompt
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your school list is empty</h3>
                  <p className="text-muted-foreground mb-4">
                    Add schools to your list to start managing essays.
                  </p>
                  <Link to="/schools">
                    <Button>Go to School List</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Essays;
