import { Link, useLocation } from "react-router-dom";
import { 
  GraduationCap, 
  User, 
  BookOpen, 
  Calendar, 
  FileText,
  BarChart3,
  Settings,
  Users,
  Newspaper
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import NotificationsDropdown from "@/components/ui/notifications-dropdown";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "/dashboard",
  },
  {
    title: "Profile",
    icon: User,
    url: "/profile",
  },
  {
    title: "Schools",
    icon: BookOpen,
    url: "/schools",
  },
  {
    title: "Essays",
    icon: FileText,
    url: "/essays",
  },
];

const resourceItems = [
  {
    title: "Admitted Profiles",
    icon: Users,
    url: "/resources/admitted-profiles",
  },
  {
    title: "Blog",
    icon: Newspaper,
    url: "/resources/admitted-students-blog",
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar h-screen overflow-hidden">
      <SidebarHeader className="p-6 flex-shrink-0">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-medium text-foreground">MyBlueprint</h1>
            <p className="text-sm text-muted-foreground">College Applications</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 flex-1 overflow-hidden">
        <SidebarGroup className="h-full">
          <SidebarGroupLabel className="text-muted-foreground uppercase tracking-wider text-xs font-medium mb-2 flex-shrink-0">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex-1 overflow-y-auto">
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      className={cn(
                        "h-11 px-4 rounded-xl transition-all duration-200",
                        isActive 
                          ? "bg-zinc-800 text-white border border-gray-600" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Link to={item.url} className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>

            {/* Resources section directly below navigation */}
            <div className="mt-8">
              <div className="text-muted-foreground uppercase tracking-wider text-xs font-medium mb-2 flex-shrink-0">
                Resources (debug)
              </div>
              <SidebarMenu className="space-y-1">
                {resourceItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={cn(
                          "h-11 px-4 rounded-xl transition-all duration-200",
                          isActive 
                            ? "bg-zinc-800 text-white border border-gray-600" 
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <Link to={item.url} className="flex items-center space-x-3">
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                className="h-11 px-4 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Link to="/settings" className="flex items-center space-x-3">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <NotificationsDropdown />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
