
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ProfileData {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileStrength {
  overall: number;
  academic: number;
  extracurricular: number;
  personality: number;
}

export const useProfileData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile-data', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as ProfileData;
    },
    enabled: !!user,
  });
};

export const calculateProfileStrength = (profile: ProfileData | undefined): ProfileStrength => {
  if (!profile) {
    return {
      overall: 0,
      academic: 0,
      extracurricular: 0,
      personality: 0
    };
  }

  // Calculate completion based on available data
  let completionScore = 0;
  let totalFields = 3; // email, full_name, and basic profile existence

  if (profile.email) completionScore += 1;
  if (profile.full_name) completionScore += 1;
  if (profile.id) completionScore += 1; // Profile exists

  const completionPercentage = Math.round((completionScore / totalFields) * 100);

  // For now, return basic scores based on profile completion
  // In the future, this can be expanded to include more detailed profile fields
  return {
    overall: completionPercentage,
    academic: profile.full_name ? 25 : 0, // Basic academic info if name exists
    extracurricular: 0, // No extracurricular data yet
    personality: profile.full_name ? 15 : 0 // Basic personality info if name exists
  };
};

export const useProfileStrength = () => {
  const { data: profile, isLoading, error } = useProfileData();
  
  const strength = calculateProfileStrength(profile);
  
  return {
    strength,
    isComplete: strength.overall > 80,
    isLoading,
    error
  };
};
