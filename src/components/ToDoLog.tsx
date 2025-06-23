import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Plus, Pencil } from 'lucide-react';

interface ToDo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface PlannedWeek {
  weekLabel: string;
  goal: string;
  tasks: string[];
}

const ToDoLog = () => {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPlanNextWeekDialogOpen, setIsPlanNextWeekDialogOpen] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState("");
  const [individualTasks, setIndividualTasks] = useState<string[]>([""]);
  const [plannedWeeks, setPlannedWeeks] = useState<PlannedWeek[]>([]);
  const [editWeekIndex, setEditWeekIndex] = useState<number | null>(null); // null = not editing, 0 = current week, 1+ = plannedWeeks

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
  const weekLabel = getWeekLabelRange(today);

  // For "Plan Next Week" card
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const nextWeekLabel = getWeekLabelRange(nextWeek);

  // Open dialog for editing a week
  const openEditDialog = (weekIdx: number | null) => {
    setEditWeekIndex(weekIdx);
    if (weekIdx === 0) {
      // Editing current week
      setWeeklyGoal(currentWeekData.goal || "");
      setIndividualTasks(currentWeekData.tasks || [""]);
    } else if (weekIdx != null && plannedWeeks[weekIdx - 1]) {
      setWeeklyGoal(plannedWeeks[weekIdx - 1].goal);
      setIndividualTasks(plannedWeeks[weekIdx - 1].tasks.length ? plannedWeeks[weekIdx - 1].tasks : [""]);
    } else {
      setWeeklyGoal("");
      setIndividualTasks([""]);
    }
    setIsDialogOpen(true);
  };

  // Save handler for both current and planned weeks
  const handleSaveWeeklyLog = () => {
    const tasks = individualTasks.filter(task => task.trim() !== "");
    if (editWeekIndex === 0) {
      // Save to current week (replace with your logic)
      // For now, just log
      console.log("Save current week:", { goal: weeklyGoal, tasks });
    } else if (editWeekIndex != null && editWeekIndex > 0) {
      setPlannedWeeks(prev => prev.map((w, i) => i === editWeekIndex - 1 ? { ...w, goal: weeklyGoal, tasks } : w));
    } else {
      // Add new planned week
      setPlannedWeeks(prev => [
        ...prev,
        {
          weekLabel: nextWeekLabel,
          goal: weeklyGoal,
          tasks,
        },
      ]);
    }
    setIsDialogOpen(false);
    setWeeklyGoal("");
    setIndividualTasks([""]);
    setEditWeekIndex(null);
  };

  // Dummy current week data (replace with real data if available)
  const currentWeekData = { goal: '', tasks: [] as string[] };

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
            {currentWeekData.goal ? (
              <>
                <div className="mb-2 text-muted-foreground">{currentWeekData.goal}</div>
                <ul className="list-disc pl-5 text-sm">
                  {currentWeekData.tasks.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-muted-foreground mb-4">No to-dos yet for this week.</div>
              </div>
            )}
          </Card>
          {/* Planned weeks */}
          {plannedWeeks.map((week, idx) => (
            <Card key={week.weekLabel + idx} className="h-80 flex flex-col p-4 relative">
              <button
                className="absolute top-2 right-2 p-1 rounded hover:bg-muted"
                onClick={() => openEditDialog(idx + 1)}
                aria-label="Edit week"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </button>
              <div className="font-semibold mb-2">{week.weekLabel}</div>
              <div className="mb-2 text-muted-foreground">{week.goal}</div>
              <ul className="list-disc pl-5 text-sm">
                {week.tasks.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </Card>
          ))}
          {/* Plan Next Week cell */}
          <Card
            className="h-80 flex flex-col items-center justify-center cursor-pointer hover:bg-muted relative"
            onClick={() => openEditDialog(null)}
          >
            <button
              className="absolute top-2 right-2 p-1 rounded hover:bg-muted"
              onClick={e => { e.stopPropagation(); openEditDialog(null); }}
              aria-label="Edit week"
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </button>
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