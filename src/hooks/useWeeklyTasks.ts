
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface WeeklyTask {
  id: string;
  user_id: string;
  week_start_date: string;
  week_goal: string | null;
  tasks: string[];
  created_at: string;
  updated_at: string;
}

export const useWeeklyTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Helper function to get the start of the week (Monday)
  const getWeekStartDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  // Get current week's tasks
  const { data: currentWeekTasks, isLoading } = useQuery({
    queryKey: ['weeklyTasks', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const weekStart = getWeekStartDate(new Date());
      const weekStartString = weekStart.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('weekly_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartString)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Get planned weeks (future weeks)
  const { data: plannedWeeks } = useQuery({
    queryKey: ['plannedWeeks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const nextWeekString = nextWeek.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('weekly_tasks')
        .select('*')
        .eq('user_id', user.id)
        .gte('week_start_date', nextWeekString)
        .order('week_start_date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Mutation to save weekly tasks
  const saveWeeklyTasksMutation = useMutation({
    mutationFn: async ({ weekStartDate, goal, tasks }: { weekStartDate: string; goal: string; tasks: string[] }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('weekly_tasks')
        .upsert({
          user_id: user.id,
          week_start_date: weekStartDate,
          week_goal: goal,
          tasks: tasks,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyTasks', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['plannedWeeks', user?.id] });
    },
  });

  const saveWeeklyTasks = (weekStartDate: string, goal: string, tasks: string[]) => {
    return saveWeeklyTasksMutation.mutateAsync({ weekStartDate, goal, tasks });
  };

  return {
    currentWeekTasks,
    plannedWeeks: plannedWeeks || [],
    isLoading,
    saveWeeklyTasks,
    getWeekStartDate,
  };
};
