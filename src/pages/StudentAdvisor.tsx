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
  const { advisor, requests, requestsLoading } = useAdvisor();
  const { tasks, tasksLoading, updateTaskStatus } = useAdvisorTasks();

  const handleTaskStatusUpdate = async (taskId, status) => {
    await updateTaskStatus(taskId, status);
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const myRequests = requests.filter(request => !request.advisor_id);

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
              <div className="text-base font-bold">
                {advisor ? 'Assigned' : 'Not Assigned'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advisor Info */}
        {advisor && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Advisor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-base font-semibold">{advisor.advisor?.full_name}</p>
                <p className="text-muted-foreground">{advisor.advisor?.email}</p>
                <p className="text-sm text-muted-foreground">
                  Advisor since {format(new Date(advisor.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

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
                                From {task.advisor?.full_name}
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
                                From {task.advisor?.full_name}
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
              {requestsLoading ? (
                <p>Loading requests...</p>
              ) : myRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No advisor requests found.</p>
                  </CardContent>
                </Card>
              ) : (
                myRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            Request to {request.advisor?.full_name}
                          </CardTitle>
                          <CardDescription>{request.advisor?.email}</CardDescription>
                        </div>
                        <Badge 
                          variant={
                            request.status === 'approved' ? 'default' : 
                            request.status === 'rejected' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {request.message && <p>{request.message}</p>}
                      <p className="text-sm text-muted-foreground">
                        Sent on {format(new Date(request.created_at), 'MMM dd, yyyy')}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentAdvisor;
