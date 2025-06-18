import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Schools from "./pages/Schools";
import AdminSchools from "./pages/AdminSchools";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Essays from "./pages/Essays";
import NotFound from "./pages/NotFound";
import { AppSidebar } from "./components/layout/AppSidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground font-sf-pro">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <div className="flex min-h-screen w-full">
                      <AppSidebar />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/schools" element={<Schools />} />
                          <Route path="/admin/schools" element={
                            <ProtectedRoute adminOnly>
                              <AdminSchools />
                            </ProtectedRoute>
                          } />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/profile/edit/:step" element={<ProfileEdit />} />
                          <Route path="/essays" element={<Essays />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
