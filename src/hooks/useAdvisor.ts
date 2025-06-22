
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useAdvisor = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch advisor-student requests
  const useAdvisorRequests = () => {
    return useQuery({
      queryKey: ['advisor-requests', user?.id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('advisor_student_requests')
          .select(`
            *,
            advisor:profiles!advisor_student_requests_advisor_id_fkey(full_name, email),
            student:profiles!advisor_student_requests_student_id_fkey(full_name, email)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
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
          .select(`
            *,
            student:profiles!advisor_students_student_id_fkey(full_name, email)
          `)
          .eq('advisor_id', user?.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
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
          .select(`
            *,
            advisor:profiles!advisor_students_advisor_id_fkey(full_name, email)
          `)
          .eq('student_id', user?.id)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data;
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
    useAdvisorRequests,
    useAdvisorStudents,
    useStudentAdvisor,
    sendAdvisorRequest,
    respondToRequest,
  };
};
