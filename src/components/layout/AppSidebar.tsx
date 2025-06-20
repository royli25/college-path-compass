
import {
  FileText,
  GraduationCap,
  Home,
  LogOut,
  School,
  Settings,
  User,
  Users,
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
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return location.pathname === "/dashboard"
    }
    return location.pathname.startsWith(url)
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b bg-background/50">
        <div className="flex items-center justify-between px-2 py-3">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">MyBlueprint</span>
          </Link>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* My Application Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            My Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {myApplicationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="h-10 px-3 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
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
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {resourcesItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="h-10 px-3 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t bg-background/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={isActive("/settings")}
              className="h-10 px-3 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Link to="/settings">
                <Settings className="h-4 w-4" />
                <span className="font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <Separator className="my-2" />
        
        <div className="px-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start h-10 px-3 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
