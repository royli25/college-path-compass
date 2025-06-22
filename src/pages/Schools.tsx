import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, DollarSign, Star, BookOpen, FileText, Trash2 } from "lucide-react";
import { useUserSchools } from "@/hooks/useSchools";
import AddSchoolFromCatalogDialog from "@/components/AddSchoolFromCatalogDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Schools = () => {
  const { userRole } = useAuth();
  const queryClient = useQueryClient();
  const { data: schools = [], isLoading, error } = useUserSchools();

  // Delete school mutation
  const deleteSchoolMutation = useMutation({
    mutationFn: async (schoolId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_school_lists')
        .delete()
        .match({ user_id: user.id, id: schoolId });

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

  // Fetch research status for all schools
  const { data: researchData = [] } = useQuery({
    queryKey: ['school-research-status'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('school_research')
        .select('school_id, content')
        .eq('user_id', user.id);

      if (error) return [];
      return data || [];
    },
    enabled: !!userRole && userRole === 'student'
  });

  // Create a map of school IDs to research content
  const researchMap = researchData.reduce((acc, research) => {
    acc[research.school_id] = research.content;
    return acc;
  }, {} as Record<string, string>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "In Progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Not Started":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const handleDeleteSchool = (schoolId: string, schoolName: string) => {
    if (confirm(`Are you sure you want to remove ${schoolName} from your school list? This will also remove any associated essays and research documents.`)) {
      deleteSchoolMutation.mutate(schoolId);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="ultra-card text-center py-12">
            <CardContent>
              <p className="text-lg text-destructive mb-4">Error loading schools</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-medium text-foreground tracking-tight">
              {userRole === 'admin' ? 'All School Lists' : 'My School List'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {userRole === 'admin' ? 'Manage all student school lists' : 'Research and organize your target colleges'}
            </p>
          </div>
          {userRole === 'student' && <AddSchoolFromCatalogDialog />}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="ultra-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* School List - no type grouping or badge */}
        {!isLoading && schools.length > 0 && (
          <div className="space-y-4">
            {schools.map(school => {
              const hasResearch = researchMap[school.id] && researchMap[school.id].trim().length > 0;
              
              return (
                <Card key={school.id} className="ultra-card smooth-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-medium text-foreground">{school.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                {school.location && (
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{school.location}</span>
                                  </div>
                                )}
                                {school.ranking && (
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3" />
                                    <span>{school.ranking}</span>
                                  </div>
                                )}
                                {userRole === 'student' && (
                                  <div className="flex items-center space-x-1">
                                    <FileText className="h-3 w-3" />
                                    <span>{hasResearch ? 'Research Available' : 'No Research'}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {/* Removed status tag */}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {school.acceptance_rate && (
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Accept Rate:</span>
                                <span className="text-foreground font-medium">{school.acceptance_rate}</span>
                              </div>
                            )}
                            {school.tuition && (
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Tuition:</span>
                                <span className="text-foreground font-medium">{school.tuition}</span>
                              </div>
                            )}
                            {school.major && (
                              <div className="flex items-center space-x-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Major:</span>
                                <span className="text-foreground font-medium">{school.major}</span>
                              </div>
                            )}
                            {school.deadline && (
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">Deadline:</span>
                                <span className="text-foreground font-medium">
                                  {new Date(school.deadline).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button variant="outline" size="sm" className="rounded-xl">
                          View Details
                        </Button>
                        <Link to={`/schools/${school.id}/research`}>
                          <Button 
                            variant={hasResearch ? "default" : "secondary"} 
                            size="sm" 
                            className={`rounded-xl w-full flex items-center gap-2 ${
                              hasResearch 
                                ? "bg-blue-600 text-white hover:bg-blue-700" 
                                : "bg-white text-black hover:bg-gray-100"
                            }`}
                          >
                            <FileText className="h-4 w-4" />
                            {hasResearch ? 'View Research' : 'Research Document'}
                          </Button>
                        </Link>
                        {userRole === 'student' && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="rounded-xl w-full flex items-center gap-2"
                            onClick={() => handleDeleteSchool(school.id, school.name)}
                            disabled={deleteSchoolMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && schools.length === 0 && (
          <Card className="ultra-card text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No schools in your list yet.</p>
                <p className="text-sm">Add your first school to get started!</p>
              </div>
              {userRole === 'student' && <AddSchoolFromCatalogDialog />}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Schools;
