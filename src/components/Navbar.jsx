
import { useState } from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const { toast } = useToast();
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    
    toast({
      title: isDark ? "Light mode activated" : "Dark mode activated",
      description: "Your preference has been saved",
    });
  };
  
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2 md:w-64">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        
        <div className="flex flex-1 items-center justify-end md:justify-between">
          <div className="relative hidden md:flex">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="h-9 w-64 rounded-md border border-input bg-background pl-10 pr-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              className="rounded-full p-2 hover:bg-accent transition-colors"
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              className="rounded-full p-2 hover:bg-accent transition-colors relative"
              onClick={() => {
                toast({
                  title: "Notifications",
                  description: "You have 3 unread notifications",
                });
              }}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gym-red text-[10px] font-medium text-white">
                3
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
