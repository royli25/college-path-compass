import { Link, useLocation } from "react-router-dom";
import {
  GraduationCap,
  User,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  Users,
  Newspaper,
  UserCheck,
  MessageSquare,
  LogOut,
  ChevronUp,
  ChevronDown,
  Home,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationsDropdown from "@/components/ui/notifications-dropdown";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const studentNavigationItems = [
  {
    title: "Dashboard",
    icon: Home,
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

const advisorNavigationItems = [
  {
    title: "Advisor Dashboard",
    icon: BarChart3,
    url: "/advisor/dashboard",
  },
  {
    title: "My Students",
    icon: UserCheck,
    url: "/student/advisor",
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
  const { user, userRole, signOut } = useAuth();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const navigationItems = userRole === 'advisor' ? advisorNavigationItems : studentNavigationItems;

  return (
    <Sidebar className="border-r bg-background h-screen overflow-hidden flex flex-col">
      <SidebarHeader className="px-4 pb-4 pt-5 flex-shrink-0">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/myblueprint.png" alt="MyBlueprint Logo" className="h-7 w-auto block dark:hidden ml-3" />
          <img src="/myblueprint_dark.png" alt="MyBlueprint Logo" className="h-7 w-auto hidden dark:block ml-3" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground uppercase tracking-wider text-xs font-medium mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {navigationItems.map((item, idx) => {
              const isActive = location.pathname.startsWith(item.url);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={`h-9 px-3 justify-start ${isActive ? '!bg-gray-200 !text-gray-900 !font-medium !hover:bg-gray-200 !hover:text-gray-900 dark:!bg-gray-700 dark:!text-gray-100 dark:!hover:bg-gray-700 dark:!hover:text-gray-100' : ''}`}
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-muted-foreground uppercase tracking-wider text-xs font-medium mb-2">
            Resources
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1">
            {resourceItems.map((item) => {
              const isActive = location.pathname.startsWith(item.url);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="h-9 px-3 justify-start"
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border mt-auto flex-shrink-0">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center w-full text-left hover:bg-secondary rounded-md p-2 transition-colors duration-100">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                </div>
                <ChevronUp className="h-4 w-4 text-muted-foreground ml-2" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="ml-2">
            <NotificationsDropdown />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
