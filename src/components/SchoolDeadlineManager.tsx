
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Save, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface School {
  id: string;
  name: string;
  application_deadline?: string | null;
}

interface SchoolDeadlineManagerProps {
  school: School;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

const SchoolDeadlineManager = ({ school, isEditing, onStartEdit, onCancelEdit }: SchoolDeadlineManagerProps) => {
  const [deadline, setDeadline] = useState(school.application_deadline || '');
  const queryClient = useQueryClient();

  const updateDeadlineMutation = useMutation({
    mutationFn: async (newDeadline: string) => {
      const { data, error } = await supabase
        .from('user_school_lists')
        .update({ application_deadline: newDeadline || null })
        .eq('id', school.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-schools'] });
      toast.success('Application deadline updated successfully!');
      onCancelEdit();
    },
    onError: (error) => {
      toast.error('Failed to update deadline: ' + error.message);
    }
  });

  const handleSave = () => {
    updateDeadlineMutation.mutate(deadline);
  };

  const handleCancel = () => {
    setDeadline(school.application_deadline || '');
    onCancelEdit();
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {school.application_deadline 
              ? `Deadline: ${format(new Date(school.application_deadline), "MMM d, yyyy")}`
              : "No deadline set"
            }
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onStartEdit}>
          Set Deadline
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Set Application Deadline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="deadline">Application Deadline</Label>
          <Input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={updateDeadlineMutation.isPending}>
            <Save className="mr-1 h-4 w-4" />
            {updateDeadlineMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolDeadlineManager;
