
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, GraduationCap, DollarSign, Calendar, Plus, Trash2, Edit3, CalendarIcon } from "lucide-react";
import { useUserSchools } from "@/hooks/useSchools";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AddSchoolFromCatalogDialog from "@/components/AddSchoolFromCatalogDialog";
import { Link } from "react-router-dom";
import SchoolDeadlineManager from "@/components/SchoolDeadlineManager";
import { format } from "date-fns";

const Schools = () => {
  const { data: schools = [], isLoading } = useUserSchools();
  const [editingDeadlineFor, setEditingDeadlineFor] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const removeSchoolMutation = useMutation({
    mutationFn: async (schoolId: string) => {
      const { error } = await supabase
        .from('user_school_lists')
        .delete()
        .eq('id', schoolId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-schools'] });
      toast.success('School removed from your list');
    },
    onError: (error) => {
      toast.error('Failed to remove school: ' + error.message);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-medium text-foreground tracking-tight">My School List</h1>
            <p className="text-base text-muted-foreground">
              Track your target schools and application progress.
            </p>
          </div>
          <div className="flex gap-2">
            <AddSchoolFromCatalogDialog />
            <Link to="/school-research">
              <Button variant="outline">
                <Edit3 className="mr-2 h-4 w-4" />
                Research Notes
              </Button>
            </Link>
          </div>
        </div>

        {/* Schools Grid */}
        {schools.length === 0 ? (
          <Card className="ultra-card text-center py-12">
            <CardContent>
              <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Schools Added Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start building your school list to track your applications.
              </p>
              <AddSchoolFromCatalogDialog />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <Card key={school.id} className="ultra-card hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {school.name}
                      </CardTitle>
                      {school.location && (
                        <div className="flex items-center text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{school.location}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSchoolMutation.mutate(school.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* School Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {school.type && (
                      <div>
                        <span className="font-medium text-muted-foreground">Type:</span>
                        <p className="text-foreground">{school.type}</p>
                      </div>
                    )}
                    {school.acceptance_rate && (
                      <div>
                        <span className="font-medium text-muted-foreground">Acceptance:</span>
                        <p className="text-foreground">{school.acceptance_rate}</p>
                      </div>
                    )}
                    {school.ranking && (
                      <div>
                        <span className="font-medium text-muted-foreground">Ranking:</span>
                        <p className="text-foreground">{school.ranking}</p>
                      </div>
                    )}
                    {school.tuition && (
                      <div>
                        <span className="font-medium text-muted-foreground">Tuition:</span>
                        <p className="text-foreground">{school.tuition}</p>
                      </div>
                    )}
                  </div>

                  {/* Major */}
                  {school.major && (
                    <div className="pt-2">
                      <span className="font-medium text-muted-foreground text-sm">Intended Major:</span>
                      <p className="text-sm text-foreground">{school.major}</p>
                    </div>
                  )}

                  {/* Application Status */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-medium text-muted-foreground text-sm">Status:</span>
                      <Badge variant={school.status === 'Submitted' ? 'default' : 'secondary'} className="ml-2">
                        {school.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Deadline Management */}
                  <SchoolDeadlineManager
                    school={school}
                    isEditing={editingDeadlineFor === school.id}
                    onStartEdit={() => setEditingDeadlineFor(school.id)}
                    onCancelEdit={() => setEditingDeadlineFor(null)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schools;
