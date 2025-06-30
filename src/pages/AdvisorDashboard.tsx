import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, CheckCircle, Clock, Plus, Search, UserPlus, MessageSquare, ListTodo } from "lucide-react";
import { useAdvisor } from "@/hooks/useAdvisor";
import { useAdvisorTasks } from "@/hooks/useAdvisorTasks";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AdvisorDashboard = () => {
  const { useAdvisorStudents, useAdvisorRequests, respondToRequest, useSearchStudents, sendConnectionRequest } = useAdvisor();
  const { useAdvisorTasksQuery, createTask } = useAdvisorTasks();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);
  const [selectedStudentForConnection, setSelectedStudentForConnection] = useState<any>(null);
  const [connectionMessage, setConnectionMessage] = useState("");

  const { data: students = [], isLoading: studentsLoading } = useAdvisorStudents();
  const { data: requests = [], isLoading: requestsLoading } = useAdvisorRequests();
  const { data: tasks = [], isLoading: tasksLoading } = useAdvisorTasksQuery();
  const { data: searchResults = [], isLoading: searchLoading } = useSearchStudents(searchTerm);
  console.log(searchResults);

  const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createTask.mutate({
      student_id: selectedStudentId,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      due_date: formData.get('due_date') as string,
    });
    
    setTaskDialogOpen(false);
    e.currentTarget.reset();
  };

  const handleRequestResponse = (requestId: string, status: 'approved' | 'rejected') => {
    respondToRequest.mutate({ requestId, status });
  };

  const handleSendConnectionRequest = () => {
    if (!selectedStudentForConnection) return;

    sendConnectionRequest.mutate({
      studentId: selectedStudentForConnection.id,
      message: connectionMessage,
    });

    setConnectionDialogOpen(false);
    setSelectedStudentForConnection(null);
    setConnectionMessage("");
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Advisor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your students and tasks.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{pendingRequests.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{completedTasks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{pendingTasks}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="search">Add Students</TabsTrigger>
            <TabsTrigger value="requests">Requests ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Students</h2>
              <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <div>
                      <Label htmlFor="student">Student</Label>
                      <select
                        name="student"
                        className="w-full p-2 border rounded-md"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        required
                      >
                        <option value="">Select a student</option>
                        {students.map((student) => (
                          <option key={student.id} value={student.student_id}>
                            {student.student?.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="title">Task Title</Label>
                      <Input name="title" required />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea name="description" />
                    </div>
                    <div>
                      <Label htmlFor="due_date">Due Date</Label>
                      <Input name="due_date" type="date" />
                    </div>
                    <Button type="submit" className="w-full">Create Task</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid gap-4">
              {studentsLoading ? (
                <p>Loading students...</p>
              ) : students.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No students assigned yet.</p>
                  </CardContent>
                </Card>
              ) : (
                students.map((relationship) => (
                  <Card key={relationship.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{relationship.student?.full_name}</CardTitle>
                      <CardDescription>{relationship.student?.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Student since {format(new Date(relationship.created_at), 'MMM dd, yyyy')}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Search for Students</h2>
              <p className="text-muted-foreground">Search for students by their unique student ID to add them to your courseload and send connection requests.</p>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid gap-4">
                {searchLoading ? (
                  <p>Searching...</p>
                ) : searchResults.length === 0 && searchTerm.trim() ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">No students found with that student ID.</p>
                    </CardContent>
                  </Card>
                ) : (
                  searchResults.map((student) => (
                    <Card key={student.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{student.full_name}</CardTitle>
                        <CardDescription>
                          <div className="space-y-1">
                            <p>Student ID: {student.id}</p>
                            <p>Email: {student.email}</p>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            {student.high_school && (
                              <p className="text-sm text-muted-foreground">
                                {student.high_school}
                              </p>
                            )}
                          </div>
                          <Button
                            onClick={() => {
                              setSelectedStudentForConnection(student);
                              setConnectionDialogOpen(true);
                            }}
                            size="sm"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Send Request
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <h2 className="text-xl font-semibold">Pending Requests</h2>
            <div className="grid gap-4">
              {requestsLoading ? (
                <p>Loading requests...</p>
              ) : pendingRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No pending requests.</p>
                  </CardContent>
                </Card>
              ) : (
                pendingRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">Request from {request.student?.full_name}</CardTitle>
                      <CardDescription>{request.student?.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {request.message && (
                        <p className="text-sm text-muted-foreground mb-4">{request.message}</p>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleRequestResponse(request.id, 'approved')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRequestResponse(request.id, 'rejected')}
                          size="sm"
                          variant="destructive"
                        >
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <div className="grid gap-4">
              {tasksLoading ? (
                <p>Loading tasks...</p>
              ) : tasks.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No tasks created yet.</p>
                  </CardContent>
                </Card>
              ) : (
                tasks.map((task) => (
                  <Card key={task.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <CardDescription>
                        Assigned to: {students.find(s => s.student_id === task.student_id)?.student?.full_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                          {task.status}
                        </Badge>
                        {task.due_date && (
                          <span className="text-sm text-muted-foreground">
                            Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Connection Request Dialog */}
        <Dialog open={connectionDialogOpen} onOpenChange={setConnectionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Connection Request</DialogTitle>
            </DialogHeader>
            {selectedStudentForConnection && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/20">
                  <h3 className="font-medium">{selectedStudentForConnection.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStudentForConnection.email}</p>
                  {selectedStudentForConnection.high_school && (
                    <p className="text-sm text-muted-foreground">{selectedStudentForConnection.high_school}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="message">Message (optional)</Label>
                  <Textarea
                    id="message"
                    value={connectionMessage}
                    onChange={(e) => setConnectionMessage(e.target.value)}
                    placeholder="Add a personal message to your connection request..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setConnectionDialogOpen(false);
                      setSelectedStudentForConnection(null);
                      setConnectionMessage("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendConnectionRequest}
                    disabled={sendConnectionRequest.isPending}
                  >
                    {sendConnectionRequest.isPending ? "Sending..." : "Send Request"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdvisorDashboard;
