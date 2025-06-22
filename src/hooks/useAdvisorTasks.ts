
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const useAdvisorTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch tasks for advisor
  const useAdvisorTasksQuery = () => {
    return useQuery({
      queryKey: ['advisor-tasks', user?.id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('advisor_tasks')
          .select('*')
          .eq('advisor_id', user?.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        // Fetch student profile data separately
        const enriched = await Promise.all(
          data.map(async (task) => {
            const { data: studentProfile } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', task.student_id)
              .single();

            return {
              ...task,
              student: studentProfile
            };
          })
        );

        return enriched;
      },
      enabled: !!user,
    });
  };

  // Fetch tasks for student
  const useStudentTasksQuery = () => {
    return useQuery({
      queryKey: ['student-tasks', user?.id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('advisor_tasks')
          .select('*')
          .eq('student_id', user?.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        // Fetch advisor profile data separately
        const enriched = await Promise.all(
          data.map(async (task) => {
            const { data: advisorProfile } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', task.advisor_id)
              .single();

            return {
              ...task,
              advisor: advisorProfile
            };
          })
        );

        return enriched;
      },
      enabled: !!user,
    });
  };

  // Create task
  const createTask = useMutation({
    mutationFn: async (taskData: {
      student_id: string;
      title: string;
      description?: string;
      due_date?: string;
    }) => {
      const { data, error } = await supabase
        .from('advisor_tasks')
        .insert({
          ...taskData,
          advisor_id: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisor-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['student-tasks'] });
      toast({
        title: "Task Created",
        description: "The task has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update task status (for students)
  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: 'pending' | 'completed' }) => {
      const { data, error } = await supabase
        .from('advisor_tasks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .eq('student_id', user?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['advisor-tasks'] });
      toast({
        title: "Task Updated",
        description: "Task status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    useAdvisorTasksQuery,
    useStudentTasksQuery,
    createTask,
    updateTaskStatus,
  };
};
