import { Camera, Wand2, FolderOpen, GraduationCap, LogOut, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Gerador de Ensaios", url: "/dashboard/gerador", icon: Camera },
  { title: "Restauração Pro", url: "/dashboard/restauracao", icon: Wand2 },
  { title: "Meus Pedidos", url: "/dashboard/galeria", icon: FolderOpen },
  { title: "Treinamento & Vendas", url: "/dashboard/treinamento", icon: GraduationCap },
  { title: "Configurações API", url: "/dashboard/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <div className="p-4 flex items-center gap-3 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Camera className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2 className="font-display text-sm font-bold text-foreground truncate">
              Studio Pro <span className="text-primary">AI</span>
            </h2>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        )}
      </div>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50 text-muted-foreground"
                      activeClassName="bg-primary/10 text-primary font-medium border-l-2 border-primary"
                    >
                      <item.icon className="mr-3 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <LogOut className="mr-3 h-4 w-4 shrink-0" />
              {!collapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
