
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SchoolCatalog {
  id: string;
  name: string;
  location: string | null;
  type: string | null;
  acceptance_rate: string | null;
  tuition: string | null;
  ranking: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserSchoolList {
  id: string;
  name: string;
  location: string | null;
  type: string | null;
  application_type: string | null;
  deadline: string | null;
  status: string | null;
  acceptance_rate: string | null;
  tuition: string | null;
  major: string | null;
  ranking: string | null;
  user_id: string | null;
  school_catalog_id: string | null;
}

// Hook for schools catalog (all available schools)
export const useSchoolsCatalog = () => {
  return useQuery({
    queryKey: ['schools-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools_catalog')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as SchoolCatalog[];
    },
  });
};

// Hook for user's school list
export const useUserSchools = () => {
  return useQuery({
    queryKey: ['user-schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_school_lists')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as UserSchoolList[];
    },
  });
};

// Hook for adding school to user's list
export const useAddSchoolToList = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      schoolId, 
      major, 
      applicationDeadline 
    }: { 
      schoolId: string; 
      major?: string; 
      applicationDeadline?: string; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get school details from catalog
      const { data: school, error: schoolError } = await supabase
        .from('schools_catalog')
        .select('*')
        .eq('id', schoolId)
        .single();

      if (schoolError) throw schoolError;

      const { data, error } = await supabase
        .from('user_school_lists')
        .insert({
          name: school.name,
          location: school.location,
          type: school.type,
          acceptance_rate: school.acceptance_rate,
          tuition: school.tuition,
          ranking: school.ranking,
          major,
          deadline: applicationDeadline,
          status: 'Not Started',
          user_id: user.id,
          school_catalog_id: schoolId
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-schools'] });
    },
  });
};

// Hook for creating new schools in catalog (admin only)
export const useCreateSchoolInCatalog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (school: Omit<SchoolCatalog, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('schools_catalog')
        .insert(school)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools-catalog'] });
    },
  });
};
