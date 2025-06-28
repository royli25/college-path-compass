
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Schools from "./pages/Schools";
import SchoolResearch from "./pages/SchoolResearch";
import Essays from "./pages/Essays";
import AdminSchools from "./pages/AdminSchools";
import AdmittedProfiles from "./pages/AdmittedProfiles";
import AdmittedProfileDetail from "./pages/AdmittedProfileDetail";
import AdmittedStudentsBlog from "./pages/AdmittedStudentsBlog";
import Settings from "./pages/Settings";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import StudentAdvisor from "./pages/StudentAdvisor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <div className="flex h-screen w-full overflow-hidden">
                        <AppSidebar />
                        <main className="flex-1 bg-background overflow-y-auto">
                          <Routes>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="profile/edit/:step" element={<ProfileEdit />} />
                            <Route path="schools" element={<Schools />} />
                            <Route path="schools/:schoolId/research" element={<SchoolResearch />} />
                            <Route path="essays" element={<Essays />} />
                            <Route path="admin/schools" element={<AdminSchools />} />
                            <Route path="advisor/dashboard" element={<AdvisorDashboard />} />
                            <Route path="student/advisor" element={<StudentAdvisor />} />
                            <Route path="resources/admitted-profiles" element={<AdmittedProfiles />} />
                            <Route path="resources/admitted-profiles/:profileId" element={<AdmittedProfileDetail />} />
                            <Route path="resources/admitted-students-blog" element={<AdmittedStudentsBlog />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
                    </SidebarProvider>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
