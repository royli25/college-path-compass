
import {
  FileText,
  GraduationCap,
  Home,
  LogOut,
  School,
  Settings,
  User,
  Users,
  Moon,
  Sun,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"

// My Application menu items.
const myApplicationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Schools",
    url: "/schools",
    icon: School,
  },
  {
    title: "Essays",
    url: "/essays",
    icon: FileText,
  },
]

// Resources menu items.
const resourcesItems = [
  {
    title: "Admitted Profiles",
    url: "/resources/admitted-profiles",
    icon: Users,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return location.pathname === "/dashboard"
    }
    return location.pathname.startsWith(url)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Sidebar collapsible="none" className="border-r w-64">
      <SidebarHeader className="border-b bg-background/50">
        <div className="flex items-center justify-center px-4 py-6">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MyBlueprint</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* My Application Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            My Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {myApplicationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="h-11 px-3 rounded-lg data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Resources Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {resourcesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="h-11 px-3 rounded-lg data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t bg-background/50 p-3 space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={isActive("/settings")}
              className="h-11 px-3 rounded-lg data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Link to="/settings">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <Separator className="my-2" />
        
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="w-full justify-start h-11 px-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start h-11 px-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
