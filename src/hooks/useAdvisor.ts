import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useAdvisor = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const useSearchStudents = (searchTerm: string) => {
    return useQuery({
      queryKey: ['search-students', searchTerm],
      queryFn: async () => {
        if (!searchTerm.trim()) return [];

        // First get student role IDs
        const { data: studentRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'student');
        

        if (rolesError) throw rolesError;

        const studentIds = studentRoles.map(role => role.user_id);

        // Then search profiles filtered by student IDs
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, high_school')
          .ilike('email', `%${searchTerm}%`)
          .in('id', studentIds)
          .limit(10);

        if (error) throw error;

        const filteredData = data?.filter(profile => profile.id !== user?.id);
        
        return filteredData || [];
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
