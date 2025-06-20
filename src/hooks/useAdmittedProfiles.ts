
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdmittedProfile {
  id: string;
  name: string;
  graduation_year: number;
  high_school: string;
  gpa_unweighted: number | null;
  gpa_weighted: number | null;
  sat_score: number | null;
  act_score: number | null;
  activities: any[] | null;
  leadership_positions: string[] | null;
  honors_awards: any[] | null;
  ap_ib_courses: any[] | null;
  colleges_admitted: any[] | null;
  colleges_rejected: any[] | null;
  colleges_waitlisted: any[] | null;
  intended_major: string | null;
  essay_excerpts: any[] | null;
  profile_photo: string | null;
  background_story: string | null;
  advice: string | null;
  demographics: any | null;
  created_at: string;
  updated_at: string;
}

export const useAdmittedProfiles = () => {
  return useQuery({
    queryKey: ['admitted-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admitted_profiles')
        .select('*')
        .order('graduation_year', { ascending: false });
      
      if (error) throw error;
      return data as AdmittedProfile[];
    },
  });
};

export const useAdmittedProfile = (profileId: string | undefined) => {
  return useQuery({
    queryKey: ['admitted-profile', profileId],
    queryFn: async () => {
      if (!profileId) return null;

      const { data, error } = await supabase
        .from('admitted_profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      
      if (error) throw error;
      return data as AdmittedProfile;
    },
    enabled: !!profileId,
  });
};
