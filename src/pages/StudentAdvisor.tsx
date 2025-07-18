
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, User, Calendar } from "lucide-react";
import { useAdvisor } from "@/hooks/useAdvisor";
import { useAdvisorTasks } from "@/hooks/useAdvisorTasks";
import { format } from "date-fns";

const StudentAdvisor = () => {
  const advisorHook = useAdvisor();
  const tasksHook = useAdvisorTasks();
  
  // Extract the query results from the hooks
  const { data: studentTasksData, isLoading: tasksLoading } = tasksHook.useStudentTasksQuery();
  const updateTaskMutation = tasksHook.updateTaskStatus;

  const handleTaskStatusUpdate = async (taskId: string, status: 'pending' | 'completed') => {
    await updateTaskMutation.mutateAsync({ taskId, status });
  };

  const tasks = studentTasksData || [];
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Advisor</h1>
          <p className="text-muted-foreground">Track your tasks and communicate with your advisor</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{pendingTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{completedTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Advisor Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-base font-bold">Not Assigned</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="requests">My Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="space-y-6">
              {/* Pending Tasks */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Pending Tasks</h2>
                <div className="grid gap-4">
                  {tasksLoading ? (
                    <p>Loading tasks...</p>
                  ) : pendingTasks.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No pending tasks at the moment.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    pendingTasks.map((task) => (
                      <Card key={task.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{task.title}</CardTitle>
                              <CardDescription>
                                From Advisor
                              </CardDescription>
                            </div>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {task.description && <p>{task.description}</p>}
                          {task.due_date && (
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                            </p>
                          )}
                          <Button
                            onClick={() => handleTaskStatusUpdate(task.id, 'completed')}
                            size="sm"
                          >
                            Mark as Complete
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Completed Tasks</h2>
                  <div className="grid gap-4">
                    {completedTasks.map((task) => (
                      <Card key={task.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{task.title}</CardTitle>
                              <CardDescription>
                                From Advisor
                              </CardDescription>
                            </div>
                            <Badge>Completed</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {task.description && (
                            <p className="text-muted-foreground">{task.description}</p>
                          )}
                          {task.due_date && (
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                            </p>
                          )}
                          <Button
                            onClick={() => handleTaskStatusUpdate(task.id, 'pending')}
                            variant="outline"
                            size="sm"
                          >
                            Mark as Pending
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <h2 className="text-lg font-semibold">My Advisor Requests</h2>
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No advisor requests found.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentAdvisor;
