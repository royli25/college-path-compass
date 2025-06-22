
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useAdvisor = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Search for students to add to courseload
  const useSearchStudents = (searchTerm: string) => {
    return useQuery({
      queryKey: ['search-students', searchTerm],
      queryFn: async () => {
        if (!searchTerm.trim()) return [];

        console.log('=== STUDENT SEARCH DEBUG ===');
        console.log('Search term:', searchTerm);
        console.log('Current user ID:', user?.id);

        // 1. First search for profiles that match the email search term
        console.log('Step 1: Searching profiles with email like:', `%${searchTerm}%`);
        const { data: matchingProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email, high_school')
          .ilike('email', `%${searchTerm}%`);

        if (profilesError) {
          console.error('Error searching profiles:', profilesError);
          throw profilesError;
        }
        
        console.log('Raw matching profiles (before filtering current user):', matchingProfiles);
        
        // Let's see each profile ID specifically
        if (matchingProfiles && matchingProfiles.length > 0) {
          matchingProfiles.forEach((profile, index) => {
            console.log(`Profile ${index + 1}: ID=${profile.id}, Email=${profile.email}, Name=${profile.full_name}`);
            console.log(`Is this the current user? ${profile.id === user?.id}`);
          });
        }
        
        // Filter out current user manually to avoid issues
        const profilesExcludingCurrentUser = matchingProfiles?.filter(profile => profile.id !== user?.id) || [];
        console.log('Profiles after excluding current user:', profilesExcludingCurrentUser);
        
        if (profilesExcludingCurrentUser.length === 0) {
          console.log('No matching profiles found after excluding current user');
          return [];
        }

        // 2. Filter to only include users who have the 'student' role
        console.log('Step 2: Checking which profiles have student role');
        const profileIds = profilesExcludingCurrentUser.map(p => p.id);
        console.log('Profile IDs to check for student role:', profileIds);
        
        const { data: studentRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'student')
          .in('user_id', profileIds);

        if (rolesError) {
          console.error('Error checking student roles:', rolesError);
          throw rolesError;
        }

        const studentUserIds = studentRoles?.map(r => r.user_id) || [];
        console.log('Users with student role:', studentUserIds);

        // 3. Filter profiles to only include students
        const studentProfiles = profilesExcludingCurrentUser.filter(profile => 
          studentUserIds.includes(profile.id)
        );

        console.log('Final student profiles found:', studentProfiles);

        if (studentProfiles.length === 0) {
          console.log('No profiles found with student role');
          return [];
        }

        // 4. Filter out students already connected to this advisor
        console.log('Step 3: Checking for existing connections');
        const { data: existingConnections } = await supabase
          .from('advisor_students')
          .select('student_id')
          .eq('advisor_id', user?.id);

        const existingStudentIds = existingConnections?.map(c => c.student_id) || [];
        console.log('Students already connected to this advisor:', existingStudentIds);
        
        const availableStudents = studentProfiles.filter(student => 
          !existingStudentIds.includes(student.id)
        );

        console.log('Final available students to connect:', availableStudents);
        console.log('=== END STUDENT SEARCH DEBUG ===');
        
        return availableStudents.slice(0, 10); // Limit to 10 results
      },
      enabled: !!user && searchTerm.trim().length > 0,
    });
  };

  // Send connection request to student
  const sendConnectionRequest = useMutation({
    mutationFn: async ({ studentId, message }: { studentId: string; message?: string }) => {
      // Create the advisor request
      const { data: request, error: requestError } = await supabase
        .from('advisor_student_requests')
        .insert({
          advisor_id: user?.id,
          student_id: studentId,
          message,
          status: 'pending',
        })
        .select()
        .single();
      
      if (requestError) throw requestError;

      // Create notification for the student
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: studentId,
          title: 'New Advisor Request',
          message: `You have received a new advisor connection request. Click to view details.`,
          type: 'advisor_request',
          is_read: false,
        });

      if (notificationError) throw notificationError;

      return request;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisor-requests'] });
      queryClient.invalidateQueries({ queryKey: ['search-students'] });
      toast({
        title: "Request Sent",
        description: "Your connection request has been sent to the student.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Fetch advisor-student requests
  const useAdvisorRequests = () => {
    return useQuery({
      queryKey: ['advisor-requests', user?.id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('advisor_student_requests')
          .select(`
            *,
            advisor:advisor_id(id),
            student:student_id(id)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        // Fetch profile data separately
        const enriched = await Promise.all(
          data.map(async (request) => {
            const [advisorProfile, studentProfile] = await Promise.all([
              supabase.from('profiles').select('full_name, email').eq('id', request.advisor_id).single(),
              supabase.from('profiles').select('full_name, email').eq('id', request.student_id).single()
            ]);

            return {
              ...request,
              advisor: advisorProfile.data,
              student: studentProfile.data
            };
          })
        );

        return enriched;
      },
      enabled: !!user,
    });
  };

  // Fetch advisor's students
  const useAdvisorStudents = () => {
    return useQuery({
      queryKey: ['advisor-students', user?.id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('advisor_students')
          .select('*')
          .eq('advisor_id', user?.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        // Fetch student profile data separately
        const enriched = await Promise.all(
          data.map(async (relationship) => {
            const { data: studentProfile } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', relationship.student_id)
              .single();

            return {
              ...relationship,
              student: studentProfile
            };
          })
        );

        return enriched;
      },
      enabled: !!user,
    });
  };

  // Fetch student's advisor
  const useStudentAdvisor = () => {
    return useQuery({
      queryKey: ['student-advisor', user?.id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('advisor_students')
          .select('*')
          .eq('student_id', user?.id)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        if (!data) return null;

        // Fetch advisor profile data separately
        const { data: advisorProfile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', data.advisor_id)
          .single();

        return {
          ...data,
          advisor: advisorProfile
        };
      },
      enabled: !!user,
    });
  };

  // Send advisor request
  const sendAdvisorRequest = useMutation({
    mutationFn: async ({ studentId, message }: { studentId: string; message?: string }) => {
      const { data, error } = await supabase
        .from('advisor_student_requests')
        .insert({
          advisor_id: user?.id,
          student_id: studentId,
          message,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisor-requests'] });
      toast({
        title: "Request Sent",
        description: "Your advisor request has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send advisor request. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Respond to advisor request
  const respondToRequest = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: 'approved' | 'rejected' }) => {
      const { data, error } = await supabase
        .from('advisor_student_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) throw error;

      // If approved, create the advisor-student relationship
      if (status === 'approved') {
        const { error: relationError } = await supabase
          .from('advisor_students')
          .insert({
            advisor_id: data.advisor_id,
            student_id: data.student_id,
          });
        
        if (relationError) throw relationError;

        // Create notification for the advisor
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: data.advisor_id,
            title: 'Request Approved',
            message: `A student has approved your connection request.`,
            type: 'advisor_request_approved',
            is_read: false,
          });

        if (notificationError) throw notificationError;
      }
      
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['advisor-requests'] });
      queryClient.invalidateQueries({ queryKey: ['advisor-students'] });
      queryClient.invalidateQueries({ queryKey: ['student-advisor'] });
      
      toast({
        title: variables.status === 'approved' ? "Request Approved" : "Request Rejected",
        description: `The advisor request has been ${variables.status}.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to respond to request. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    useSearchStudents,
    sendConnectionRequest,
    useAdvisorRequests,
    useAdvisorStudents,
    useStudentAdvisor,
    sendAdvisorRequest,
    respondToRequest,
  };
};
