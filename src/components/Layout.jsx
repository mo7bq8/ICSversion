import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  Layers, 
  Server, 
  Activity, 
  Network, 
  Shield, 
  Settings,
  FileBarChart,
  Database,
  LogOut,
  User,
  Share2,
  HardDrive,
  Projector,
  CalendarClock,
  ClipboardCheck,
  AreaChart,
  GitBranch,
  MessagesSquare,
  Palette,
  Sun,
  Moon,
  Sparkles,
  Menu,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/executive', label: 'Executive Dashboards', icon: AreaChart },
  { path: '/business', label: 'Business Capabilities', icon: Building2 },
  { path: '/applications', label: 'Application Architecture', icon: Layers },
  { path: '/technology', label: 'Technology Architecture', icon: Server },
  { path: '/infrastructure', label: 'Infrastructure Architecture', icon: HardDrive },
  { path: '/network', label: 'Network Architecture', icon: Share2 },
  { path: '/data-architecture', label: 'Data Architecture', icon: Database },
  { path: '/security', label: 'Security Architecture', icon: Shield },
  { path: '/scenarios', label: 'Scenario Planning', icon: CalendarClock },
  { path: '/decisions', label: 'Decision Log', icon: ClipboardCheck },
  { path: '/visualizations', label: 'Visualizations', icon: Projector },
  { path: '/integrations', label: 'Integrations', icon: GitBranch },
  { path: '/collaboration', label: 'Collaboration', icon: MessagesSquare },
  { path: '/customization', label: 'Customization', icon: Palette },
  { path: '/ics', label: 'ICS Levels', icon: Activity },
  { path: '/relations', label: 'Relations Matrix', icon: Network },
  { path: '/reports', label: 'Reports', icon: FileBarChart },
  { path: '/admin', label: 'Admin Panel', icon: Settings },
];

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-muted">
      <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('dark')} className="rounded-full">
        <Moon className="h-4 w-4" />
      </Button>
      <Button variant={theme === 'light' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('light')} className="rounded-full">
        <Sun className="h-4 w-4" />
      </Button>
      <Button variant={theme === 'organization' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('organization')} className="rounded-full">
        <Sparkles className="h-4 w-4" />
      </Button>
      <Button variant={theme === 'modern-light' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme('modern-light')} className="rounded-full">
        <Palette className="h-4 w-4" />
      </Button>
    </div>
  );
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSidebarCollapsed, toggleSidebar } = useTheme();

  const handleLogout = () => {
    logout();
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    navigate('/login');
  };

  const visibleNavItems = user?.pageAccess?.length > 0 
    ? navItems.filter(item => user.pageAccess.includes(item.label) || ['/', '/admin'].includes(item.path))
    : navItems;

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isSidebarCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-card text-card-foreground flex flex-col border-r border-border overflow-hidden"
    >
      <div className="p-4 flex items-center justify-between border-b border-border h-[69px]">
        <AnimatePresence>
        {!isSidebarCollapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Network className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground whitespace-nowrap">KIPIC EA</h1>
          </motion.div>
        )}
        </AnimatePresence>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="flex-shrink-0">
          {isSidebarCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
        </Button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
        {visibleNavItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium',
                isSidebarCollapsed && 'justify-center',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary text-muted-foreground hover:text-secondary-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border space-y-4">
        {!isSidebarCollapsed && <ThemeSwitcher />}
        <div className={cn("flex items-center", isSidebarCollapsed ? "justify-center" : "justify-between")}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm font-semibold text-foreground whitespace-nowrap">{user?.name || 'Demo User'}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{user?.role || 'Tester'}</p>
              </motion.div>
            )}
          </div>
          {!isSidebarCollapsed && (
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="md:hidden bg-card border-b border-border p-4 flex items-center">
      <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
        <Menu className="h-6 w-6" />
      </Button>
      <div className="flex-1 text-center text-lg font-bold">KIPIC EA</div>
    </header>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();
  const { theme, isSidebarCollapsed, toggleSidebar } = useTheme();
  
  return (
    <div className={`flex h-screen bg-background text-foreground ${theme}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;