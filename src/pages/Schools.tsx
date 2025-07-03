import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users, DollarSign, Star, BookOpen, FileText, Trash2, Eye } from "lucide-react";
import { useUserSchools } from "@/hooks/useSchools";
import AddSchoolFromCatalogDialog from "@/components/AddSchoolFromCatalogDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { School } from "lucide-react";

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
        return "bg-primary/20 text-primary border-primary/30";
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
              <p className="text-base text-destructive mb-4">Error loading schools</p>
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
            <h1 className="text-3xl font-medium text-foreground tracking-tight">
              {userRole === 'admin' ? 'All School Lists' : 'My School List'}
            </h1>
            <p className="text-base text-muted-foreground">
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
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-6">
                      {/* Left: School Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-foreground mb-1 truncate">{school.name}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
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
                          {school.acceptance_rate && (
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>Accept Rate: <span className="font-medium text-foreground">{school.acceptance_rate}</span></span>
                            </div>
                          )}
                          {school.tuition && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3" />
                              <span>Tuition: <span className="font-medium text-foreground">{school.tuition}</span></span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Action Icons */}
                      <div className="flex items-center gap-3 ml-4">
                        <Button variant="ghost" size="icon" className="hover:bg-muted" title="View Details">
                          <Eye className="h-5 w-5" />
                        </Button>
                        <Link to={`/schools/${school.id}/research`}>
                          <Button variant="ghost" size="icon" className="hover:bg-muted" title="Research Document">
                            <FileText className="h-5 w-5" />
                          </Button>
                        </Link>
                        {userRole === 'student' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover:bg-destructive/10 text-destructive"
                            onClick={() => handleDeleteSchool(school.id, school.name)}
                            disabled={deleteSchoolMutation.isPending}
                            title="Remove"
                          >
                            <Trash2 className="h-5 w-5" />
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
          <Card className="ultra-card">
            <CardContent className="text-center py-12">
              <School className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground">No schools in your list yet</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Add schools from our catalog to start tracking your applications.
              </p>
              <AddSchoolFromCatalogDialog />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Schools;
