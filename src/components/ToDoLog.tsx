import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Plus, Pencil } from 'lucide-react';
import { useWeeklyTasks } from "@/hooks/useWeeklyTasks";
import { toast } from "sonner";

interface ToDo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const ToDoLog = () => {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState("");
  const [individualTasks, setIndividualTasks] = useState<string[]>([""]);
  const [editWeekIndex, setEditWeekIndex] = useState<number | null>(null);
  const [editWeekStartDate, setEditWeekStartDate] = useState<string | null>(null);
  
  const { 
    currentWeekTasks, 
    plannedWeeks, 
    isLoading, 
    saveWeeklyTasks, 
    getWeekStartDate 
  } = useWeeklyTasks();

  const handleAddToDo = (title: string, description: string) => {
    const newToDo = {
      id: todos.length + 1,
      title,
      description,
      completed: false
    };
    setTodos([...todos, newToDo]);
    setIsDialogOpen(false);
  };

  const toggleToDo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Helper to format week label correctly
  function getWeekLabelRange(startDate: Date) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    const startMonth = startDate.toLocaleString('default', { month: 'long' });
    const endMonth = endDate.toLocaleString('default', { month: 'long' });
    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()}–${endDate.getDate()}`;
    } else {
      return `${startMonth} ${startDate.getDate()}–${endMonth} ${endDate.getDate()}`;
    }
  }

  const today = new Date();
  const currentWeekStart = getWeekStartDate(today);
  const weekLabel = getWeekLabelRange(currentWeekStart);

  // Open dialog for editing a week
  const openEditDialog = (weekIdx: number | null, weekStartDate?: string) => {
    setEditWeekIndex(weekIdx);
    setEditWeekStartDate(weekStartDate || null);
    
    if (weekIdx === 0) {
      // Editing current week
      setWeeklyGoal(currentWeekTasks?.week_goal || "");
      setIndividualTasks(currentWeekTasks?.tasks && currentWeekTasks.tasks.length > 0 ? currentWeekTasks.tasks : [""]);
    } else if (weekIdx != null && weekIdx > 0 && plannedWeeks[weekIdx - 1]) {
      // Editing existing planned week
      const week = plannedWeeks[weekIdx - 1];
      setWeeklyGoal(week.week_goal || "");
      setIndividualTasks(week.tasks && week.tasks.length > 0 ? week.tasks : [""]);
    } else {
      // Planning new week (weekIdx is null)
      setWeeklyGoal("");
      setIndividualTasks([""]);
    }
    setIsDialogOpen(true);
  };

  // Save handler for both current and planned weeks
  const handleSaveWeeklyLog = async () => {
    const tasks = individualTasks.filter(task => task.trim() !== "");
    
    try {
      let weekStartString: string;
      
      if (editWeekIndex === 0) {
        // Save current week
        weekStartString = currentWeekStart.toISOString().split('T')[0];
        await saveWeeklyTasks(weekStartString, weeklyGoal, tasks);
        toast.success("Current week updated successfully!");
      } else if (editWeekIndex != null && editWeekIndex > 0) {
        // Save existing planned week
        weekStartString = editWeekStartDate!;
        await saveWeeklyTasks(weekStartString, weeklyGoal, tasks);
        toast.success("Week updated successfully!");
      } else {
        // Save new planned week - calculate the next available week
        let nextWeekStart: Date;
        
        if (plannedWeeks.length === 0) {
          // No planned weeks yet, use next week
          nextWeekStart = new Date(today);
          nextWeekStart.setDate(today.getDate() + 7);
          nextWeekStart = getWeekStartDate(nextWeekStart);
        } else {
          // Find the latest planned week and add one more week
          const latestPlannedWeek = plannedWeeks[plannedWeeks.length - 1];
          nextWeekStart = new Date(latestPlannedWeek.week_start_date);
          nextWeekStart.setDate(nextWeekStart.getDate() + 7);
        }
        
        weekStartString = nextWeekStart.toISOString().split('T')[0];
        await saveWeeklyTasks(weekStartString, weeklyGoal, tasks);
        toast.success("New week planned successfully!");
      }
      
      setIsDialogOpen(false);
      setWeeklyGoal("");
      setIndividualTasks([""]);
      setEditWeekIndex(null);
      setEditWeekStartDate(null);
    } catch (error) {
      console.error('Error saving weekly tasks:', error);
      toast.error("Failed to save weekly tasks. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-medium text-foreground">Weekly Log</h2>
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-80 flex flex-col p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium text-foreground">Weekly Log</h2>
      <div className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Current week cell */}
          <Card className="h-80 flex flex-col p-4 relative">
            <button
              className="absolute top-2 right-2 p-1 rounded hover:bg-muted"
              onClick={() => openEditDialog(0)}
              aria-label="Edit week"
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="font-semibold mb-2">{weekLabel}</div>
            {currentWeekTasks?.week_goal || (currentWeekTasks?.tasks && currentWeekTasks.tasks.length > 0) ? (
              <>
                {currentWeekTasks.week_goal && (
                  <div className="mb-2 text-muted-foreground">{currentWeekTasks.week_goal}</div>
                )}
                {currentWeekTasks.tasks && currentWeekTasks.tasks.length > 0 && (
                  <ul className="list-disc pl-5 text-sm">
                    {currentWeekTasks.tasks.map((task, i) => (
                      <li key={i}>{task}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-muted-foreground mb-4">No to-dos yet for this week.</div>
              </div>
            )}
          </Card>
          
          {/* Planned weeks */}
          {plannedWeeks.map((week, idx) => {
            const weekStart = new Date(week.week_start_date);
            const weekDisplayLabel = getWeekLabelRange(weekStart);
            
            return (
              <Card key={week.id} className="h-80 flex flex-col p-4 relative">
                <button
                  className="absolute top-2 right-2 p-1 rounded hover:bg-muted"
                  onClick={() => openEditDialog(idx + 1, week.week_start_date)}
                  aria-label="Edit week"
                >
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </button>
                <div className="font-semibold mb-2">{weekDisplayLabel}</div>
                {week.week_goal && (
                  <div className="mb-2 text-muted-foreground">{week.week_goal}</div>
                )}
                {week.tasks && week.tasks.length > 0 && (
                  <ul className="list-disc pl-5 text-sm">
                    {week.tasks.map((task, i) => (
                      <li key={i}>{task}</li>
                    ))}
                  </ul>
                )}
              </Card>
            );
          })}
          
          {/* Plan Next Week cell */}
          <Card
            className="h-80 flex flex-col items-center justify-center cursor-pointer hover:bg-muted relative"
            onClick={() => openEditDialog(null)}
          >
            <div className="text-center text-muted-foreground">
              <Plus className="mx-auto h-8 w-8" />
              <p>Plan Next Week</p>
            </div>
          </Card>
        </div>
        
        {/* Dialog for editing/adding weeks */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Goals of the week</DialogTitle>
            </DialogHeader>
            <Textarea
              className="w-full mb-4 min-h-[80px] text-base"
              placeholder="Describe your main goal(s) for the week..."
              value={weeklyGoal}
              onChange={e => setWeeklyGoal(e.target.value)}
            />
            <div className="mb-2 font-medium text-base">Individual Tasks</div>
            {individualTasks.map((task, idx) => (
              <Input
                key={idx}
                className="mb-2"
                placeholder={`Task ${idx + 1}`}
                value={task}
                onChange={e => {
                  const updated = [...individualTasks];
                  updated[idx] = e.target.value;
                  setIndividualTasks(updated);
                }}
              />
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mb-4"
              onClick={() => setIndividualTasks([...individualTasks, ""])}
            >
              + Add Task
            </Button>
            <Button
              className="w-full mt-2"
              onClick={handleSaveWeeklyLog}
            >
              Save
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

interface AddToDoFormProps {
  onAdd: (title: string, description: string) => void;
}

const AddToDoForm = ({ onAdd }: AddToDoFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title) {
      onAdd(title, description);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="ToDo Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button type="submit">Add ToDo</Button>
    </form>
  );
};

export default ToDoLog;
