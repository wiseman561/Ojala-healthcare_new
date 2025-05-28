import React from \'react\';
import { Outlet, Link } from \'react-router-dom\';
import { cn } from \'@/lib/utils\'; // Assuming shadcn/ui utils
import { Button } from \'@/components/ui/button\'; // Assuming shadcn/ui button
import { ScrollArea } from \'@/components/ui/scroll-area\'; // Assuming shadcn/ui scroll-area
import { Home, Users, BarChart2, FileText, Settings } from \'lucide-react\'; // Icons

const MainLayout: React.FC = () => {
  return (
    <div className=\"flex h-screen bg-background text-foreground\">
      {/* Sidebar */}
      <aside className=\"w-64 border-r border-border flex flex-col\">
        <div className=\"p-4 border-b border-border\">
          <h2 className=\"text-xl font-semibold text-primary\">Ojalá MD</h2>
        </div>
        <ScrollArea className=\"flex-1\">
          <nav className=\"p-4 space-y-2\">
            <Button
              variant=\"ghost\"
              className=\"w-full justify-start text-left\"
              asChild
            >
              <Link to=\"/\">
                <Home className=\"mr-2 h-4 w-4\" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant=\"ghost\"
              className=\"w-full justify-start text-left\"
              asChild
            >
              <Link to=\"/patients\">
                <Users className=\"mr-2 h-4 w-4\" />
                Patients
              </Link>
            </Button>
            <Button
              variant=\"ghost\"
              className=\"w-full justify-start text-left\"
              asChild
            >
              <Link to=\"/analytics\">
                <BarChart2 className=\"mr-2 h-4 w-4\" />
                Analytics
              </Link>
            </Button>
            <Button
              variant=\"ghost\"
              className=\"w-full justify-start text-left\"
              asChild
            >
              <Link to=\"/prescriptions\">
                <FileText className=\"mr-2 h-4 w-4\" />
                Prescriptions
              </Link>
            </Button>
            {/* Add more navigation items as needed */}
          </nav>
        </ScrollArea>
        <div className=\"p-4 border-t border-border mt-auto\">
          <Button
            variant=\"ghost\"
            className=\"w-full justify-start text-left\"
            asChild
          >
            <Link to=\"/settings\">
              <Settings className=\"mr-2 h-4 w-4\" />
              Settings
            </Link>
          </Button>
          {/* Add logout button or user profile here */}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className=\"flex-1 flex flex-col overflow-hidden\">
        {/* Optional Header */}
        <header className=\"h-16 border-b border-border flex items-center px-6 bg-paper\">
          <h1 className=\"text-lg font-semibold\">MD Dashboard</h1>
          {/* Add user menu, notifications, etc. here */}
        </header>
        
        {/* Content Body with Scroll */}
        <ScrollArea className=\"flex-1 p-6\">
          <Outlet /> {/* Child routes will render here */}
        </ScrollArea>
      </main>
    </div>
  );
};

export default MainLayout;

