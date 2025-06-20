import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ApIbCourse {
  course: string;
  score: number | null;
}

export interface ProfileData {
  id: string;
  full_name: string | null;
  email: string | null;
  gender: string | null;
  citizenship: string | null;
  race_ethnicity: string | null;
  first_generation: boolean | null;
  income_bracket: string | null;
  high_school: string | null;
  class_rank: string | null;
  gpa_unweighted: number | null;
  gpa_weighted: number | null;
  sat_act_score: string | null;
  ap_ib_courses: ApIbCourse[] | null;
  current_courses: string[] | null;
  activities: any[] | null;
  leadership_positions: string[] | null;
  years_involved: number | null;
  honors_awards: any[] | null;
  achievement_levels: string[] | null;
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
      
      // Handle the type conversion for ap_ib_courses - convert string[] to ApIbCourse[]
      const profileData = {
        ...data,
        ap_ib_courses: Array.isArray(data.ap_ib_courses) 
          ? data.ap_ib_courses.map((item: any) => 
              typeof item === 'string' 
                ? { course: item, score: null } 
                : item
            )
          : null,
      } as ProfileData;
      
      return profileData;
    },
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<ProfileData>) => {
      if (!user) throw new Error('User not authenticated');

      // Convert ApIbCourse[] to string[] for database storage
      const dbUpdates = {
        ...updates,
        ap_ib_courses: updates.ap_ib_courses 
          ? updates.ap_ib_courses.map(course => 
              typeof course === 'string' ? course : course.course
            )
          : undefined,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      // Handle the type conversion for the returned data
      const profileData = {
        ...data,
        ap_ib_courses: Array.isArray(data.ap_ib_courses) 
          ? data.ap_ib_courses.map((item: any) => 
              typeof item === 'string' 
                ? { course: item, score: null } 
                : item
            )
          : null,
      } as ProfileData;
      
      return profileData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-data'] });
    },
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

  // Background Information (affects personality)
  const backgroundFields = [
    profile.gender, profile.citizenship, profile.race_ethnicity,
    profile.first_generation, profile.income_bracket, profile.high_school, profile.class_rank
  ];
  const backgroundComplete = backgroundFields.filter(field => field !== null && field !== undefined).length;
  const backgroundScore = Math.round((backgroundComplete / backgroundFields.length) * 100);

  // Academic Profile
  const academicFields = [
    profile.gpa_unweighted, profile.gpa_weighted, profile.sat_act_score,
    profile.ap_ib_courses, profile.current_courses
  ];
  const academicComplete = academicFields.filter(field => {
    if (Array.isArray(field)) return field.length > 0;
    return field !== null && field !== undefined;
  }).length;
  const academicScore = Math.round((academicComplete / academicFields.length) * 100);

  // Extracurricular Activities
  const activitiesCount = profile.activities?.length || 0;
  const leadershipCount = profile.leadership_positions?.length || 0;
  const hasYearsInvolved = profile.years_involved !== null;
  
  let extracurricularScore = 0;
  if (activitiesCount > 0) extracurricularScore += 40;
  if (activitiesCount >= 5) extracurricularScore += 20;
  if (leadershipCount > 0) extracurricularScore += 25;
  if (hasYearsInvolved) extracurricularScore += 15;

  // Honors & Awards (affects personality)
  const honorsCount = profile.honors_awards?.length || 0;
  const achievementLevelsCount = profile.achievement_levels?.length || 0;
  let honorsScore = 0;
  if (honorsCount > 0) honorsScore += 50;
  if (achievementLevelsCount > 0) honorsScore += 50;

  // Calculate personality score (background + personal achievements)
  const personalityScore = Math.round((backgroundScore + honorsScore) / 2);

  // Overall score
  const overallScore = Math.round((academicScore + extracurricularScore + personalityScore) / 3);

  return {
    overall: overallScore,
    academic: academicScore,
    extracurricular: extracurricularScore,
    personality: personalityScore
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

export const getStepCompletion = (profile: ProfileData | undefined, step: number): boolean => {
  if (!profile) return false;

  switch (step) {
    case 0: // Background Information
      return !!(profile.gender && profile.citizenship && profile.race_ethnicity && 
               profile.first_generation !== null && profile.income_bracket && 
               profile.high_school && profile.class_rank);
    case 1: // Academic Profile
      return !!(profile.gpa_unweighted && profile.gpa_weighted && profile.sat_act_score && 
               profile.ap_ib_courses?.length && profile.current_courses?.length);
    case 2: // Activities & Leadership
      return !!(profile.activities?.length && profile.leadership_positions?.length && 
               profile.years_involved);
    case 3: // Honors & Awards
      return !!(profile.honors_awards?.length && profile.achievement_levels?.length);
    default:
      return false;
  }
};
