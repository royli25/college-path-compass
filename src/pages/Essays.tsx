
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Essay {
  id: string;
  school_name: string;
  prompt_name: string;
  content: string | null;
  word_limit: number | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const statusColors: { [key: string]: string } = {
  'drafting': 'bg-yellow-100 text-yellow-800',
  'reviewing': 'bg-primary/20 text-primary',
  'complete': 'bg-green-100 text-green-800',
  'submitted': 'bg-emerald-100 text-emerald-800'
};

const statusIcons: { [key:string]: React.ElementType } = {
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
  const [editingDeadlineForSchool, setEditingDeadlineForSchool] = useState<string | null>(null);
  const [tempDeadline, setTempDeadline] = useState<string>("");
  const [newEssay, setNewEssay] = useState({
    prompt_name: '',
    word_limit: ''
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
    const schoolName = essay.school_name;
    if (!acc[schoolName]) {
      acc[schoolName] = [];
    }
    acc[schoolName].push(essay);
    return acc;
  }, {} as Record<string, Essay[]>);

  // Update school deadline mutation
  const updateSchoolDeadlineMutation = useMutation({
    mutationFn: async ({ schoolId, deadline }: { schoolId: string, deadline: string }) => {
      const { error } = await supabase
        .from('user_school_lists')
        .update({ application_deadline: deadline || null })
        .eq('id', schoolId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-schools'] });
      toast.success('School deadline updated successfully!');
      setEditingDeadlineForSchool(null);
    },
    onError: (error) => {
      toast.error('Failed to update deadline: ' + error.message);
    }
  });

  // Add essay mutation
  const addEssayMutation = useMutation({
    mutationFn: async (essay: Omit<typeof newEssay, 'school_name'> & { school_name: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('essays')
        .insert({
          ...essay,
          word_limit: essay.word_limit ? parseInt(essay.word_limit) : null,
          user_id: user.id,
          status: 'drafting',
          content: ''
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
      setShowAddFormForSchool(null);
      setNewEssay({ prompt_name: '', word_limit: '' });
      toast.success('Essay added successfully!');
      setEditingEssay(data); // Open new essay in editor
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['essays'] });
      toast.success('Essay updated successfully!');
      if (editingEssay && data.id === editingEssay.id) {
        setEditingEssay(data as Essay);
      }
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
      }, {
        onSuccess: () => {
          setEditingEssay(null);
        }
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

  const handleSaveDeadline = (schoolId: string) => {
    updateSchoolDeadlineMutation.mutate({ schoolId, deadline: tempDeadline });
  };

  const startEditingDeadline = (schoolId: string, currentDeadline: string | null) => {
    setEditingDeadlineForSchool(schoolId);
    setTempDeadline(currentDeadline || '');
  };

  const getWordCount = (text: string | null) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
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

  const handleBackToList = () => {
    if (editorContent !== (editingEssay?.content || '')) {
      if (confirm('You have unsaved changes. Are you sure you want to go back? Your changes will be lost.')) {
        setEditingEssay(null);
      }
    } else {
      setEditingEssay(null);
    }
  };

  const handleDeleteEssay = () => {
    if (editingEssay && confirm('Are you sure you want to delete this essay?')) {
      deleteEssayMutation.mutate(editingEssay.id);
    }
  };

  const getSchoolDeadline = (schoolName: string) => {
    const school = userSchools.find(s => s.name === schoolName);
    return school?.application_deadline;
  };

  const isLoading = isLoadingEssays || isLoadingSchools;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main component render
  if (editingEssay) {
    const Icon = statusIcons[editingEssay.status || 'drafting']
    const wordCount = getWordCount(editorContent);
    const wordLimit = editingEssay.word_limit || 0;
    const progress = wordLimit > 0 ? (wordCount / wordLimit) * 100 : 0;
    const schoolDeadline = getSchoolDeadline(editingEssay.school_name);
    
    return (
      <div className="min-h-screen bg-background">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={handleBackToList}><ArrowLeft className="mr-2 h-4 w-4" /> Back to list</Button>
            <div className="flex items-center space-x-2">
              <Select onValueChange={handleUpdateStatus} value={editingEssay.status || ''}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Icon className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Set status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusIcons).map(([status, Icon]) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center">
                        <Icon className="mr-2 h-4 w-4" />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSaveEssay} disabled={updateEssayMutation.isPending}>
                {updateEssayMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
          
          {/* Editor */}
          <Card className="ultra-card">
            <CardHeader>
              <CardTitle className="text-xl">{editingEssay.school_name}</CardTitle>
              <p className="text-muted-foreground">{editingEssay.prompt_name}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-2">
                {schoolDeadline && (
                  <div className="flex items-center"><CalendarIcon className="mr-2 h-4 w-4" /> {format(new Date(schoolDeadline), "PPP")}</div>
                )}
                {wordLimit > 0 && (
                  <div className="flex items-center"><BookOpen className="mr-2 h-4 w-4" /> {wordLimit} words</div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                className="w-full h-[60vh] text-base p-4 border rounded-md"
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
              />
              <div className="text-right mt-2 text-sm text-muted-foreground">
                Word Count: {wordCount} {wordLimit > 0 && `/ ${wordLimit}`}
              </div>
              {wordLimit > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className={cn("h-2.5 rounded-full", progress > 100 ? "bg-red-500" : "bg-primary")} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delete Button */}
          <div className="mt-6 flex justify-end">
            <Button variant="destructive" onClick={handleDeleteEssay} disabled={deleteEssayMutation.isPending}>
              <Trash2 className="mr-2 h-4 w-4"/>
              Delete Essay
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed AI Assistant - Hidden on mobile, responsive width on larger screens */}
      <div 
        className={`fixed right-0 top-0 bottom-0 z-30 hidden md:block transition-all duration-300 p-4 ${
          isAiCollapsed ? "w-24" : "w-80 lg:w-96 xl:w-[400px]"
        }`}
      >
        <FloatingAIAssistant 
          isCollapsed={isAiCollapsed} 
          onToggle={() => setIsAiCollapsed(!isAiCollapsed)} 
        />
      </div>
      
      <div 
        className={`transition-all duration-300 p-8 ${
          isAiCollapsed ? "pr-16" : "pr-0 md:pr-80 lg:pr-96 xl:pr-[400px]"
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-medium text-foreground tracking-tight">Essay Management</h1>
              <p className="text-base text-muted-foreground">Track and organize your application essays.</p>
            </div>
            <div>
              {/* Optional: Add a global "Add Essay" button here if needed */}
            </div>
          </div>

          {/* School List and Essays */}
          {!isLoading && userSchools.length === 0 && (
            <Card className="ultra-card text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Schools Found</h3>
                <p className="text-sm text-muted-foreground mb-4">You need to add schools to your list before you can manage essays.</p>
                <Link to="/schools">
                  <Button>Go to My School List</Button>
                </Link>
              </CardContent>
            </Card>
          )}
          
          {!isLoading && userSchools.length > 0 && (
            <Accordion type="multiple" className="w-full space-y-4">
              {userSchools.map(school => {
                const essayCount = (essaysBySchool[school.name] || []).length;
                const hasEssays = essayCount > 0;

                return (
                  <AccordionItem value={school.id} key={school.id} className="border rounded-lg ultra-card overflow-hidden bg-background">
                    <AccordionTrigger className="flex w-full items-center justify-between p-4 hover:no-underline hover:bg-muted/50 transition-colors [&[data-state=open]>div>button]:bg-secondary">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-medium text-foreground">{school.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={hasEssays ? "default" : "secondary"} className="h-6">
                            {essayCount} {essayCount === 1 ? 'Essay' : 'Essays'}
                          </Badge>
                          {school.application_deadline && (
                            <Badge variant="outline" className="h-6 text-xs">
                              Due: {format(new Date(school.application_deadline), "MMM d")}
                            </Badge>
                          )}
                          {editingDeadlineForSchool === school.id ? (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <Input
                                type="date"
                                value={tempDeadline}
                                onChange={(e) => setTempDeadline(e.target.value)}
                                className="h-6 w-32 text-xs"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleSaveDeadline(school.id)}
                                disabled={updateSchoolDeadlineMutation.isPending}
                                className="h-6 px-2 text-xs"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingDeadlineForSchool(null)}
                                className="h-6 px-2 text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingDeadline(school.id, school.application_deadline);
                              }}
                              className="h-6 px-2 text-xs"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              {school.application_deadline ? 'Edit Deadline' : 'Set Deadline'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 md:p-6 space-y-4 border-t">
                        {hasEssays && (
                          <div className="space-y-3">
                            {(essaysBySchool[school.name] || []).map(essay => {
                              const wordCount = getWordCount(essay.content);
                              const wordLimit = essay.word_limit || 0;
                              const Icon = statusIcons[essay.status || 'drafting'];

                              return (
                                <Card 
                                  key={essay.id}
                                  className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors cursor-pointer"
                                  onClick={() => setEditingEssay(essay)}
                                >
                                  <div className="flex-1">
                                    <p className="font-medium">{essay.prompt_name}</p>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                      <span>{wordCount} / {wordLimit} words</span>
                                    </div>
                                  </div>
                                  <Badge className={cn("ml-4", statusColors[essay.status || 'drafting'])}>
                                    <Icon className="mr-1.5 h-3 w-3"/>
                                    {essay.status}
                                  </Badge>
                                </Card>
                              );
                            })}
                          </div>
                        )}

                        {/* Add Essay Button - Now positioned below essays */}
                        <div className="flex justify-center pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setShowAddFormForSchool(showAddFormForSchool === school.name ? null : school.name)}
                          >
                            <PlusIcon className="mr-2 h-4 w-4" /> Add Essay
                          </Button>
                        </div>

                        {showAddFormForSchool === school.name && (
                          <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
                            <h4 className="font-medium">Add New Essay for {school.name}</h4>
                            <div className="space-y-2">
                              <Label htmlFor="prompt_name">Essay Prompt</Label>
                              <Input
                                id="prompt_name"
                                placeholder="e.g., Why our school?"
                                value={newEssay.prompt_name}
                                onChange={e => setNewEssay({ ...newEssay, prompt_name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="word_limit">Word Limit</Label>
                              <Input
                                id="word_limit"
                                type="number"
                                placeholder="e.g., 650"
                                value={newEssay.word_limit}
                                onChange={e => setNewEssay({ ...newEssay, word_limit: e.target.value })}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" onClick={() => setShowAddFormForSchool(null)}>Cancel</Button>
                              <Button onClick={() => handleAddEssay(school.name)} disabled={addEssayMutation.isPending}>
                                {addEssayMutation.isPending ? 'Adding...' : 'Add and Edit'}
                              </Button>
                            </div>
                          </div>
                        )}

                        {!hasEssays && showAddFormForSchool !== school.name && (
                          <div className="text-center text-muted-foreground py-6">
                            <p>No essays for this school yet.</p>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
};

export default Essays;
