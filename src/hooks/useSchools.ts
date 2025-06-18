
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface School {
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
}

export const useSchools = () => {
  return useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as School[];
    },
  });
};

export const useCreateSchool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (school: Omit<School, 'id' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('schools')
        .insert({
          ...school,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
};
