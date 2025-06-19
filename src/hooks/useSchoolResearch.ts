import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SchoolResearch {
  id: string;
  school_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useSchoolResearch = (schoolId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['school-research', schoolId],
    queryFn: async () => {
      if (!schoolId) return null;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('school_research')
        .select('*')
        .eq('school_id', schoolId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as SchoolResearch;
    },
    enabled: !!schoolId
  });

  const updateResearch = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      if (!schoolId) throw new Error('School ID is required');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: existing } = await supabase
        .from('school_research')
        .select('id')
        .eq('school_id', schoolId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('school_research')
          .update({ content, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('school_research')
          .insert({
            school_id: schoolId,
            user_id: user.id,
            content
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-research', schoolId] });
    }
  });

  return {
    data,
    isLoading,
    error,
    updateResearch
  };
}; 