
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  DollarSign, 
  Dumbbell, 
  Settings, 
  Menu, 
  X,
  LogOut,
  BarChart3
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Trainers', path: '/trainers', icon: Dumbbell },
    { name: 'Classes', path: '/classes', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Finances', path: '/finances', icon: DollarSign },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className={`h-screen ${collapsed ? 'w-20' : 'w-64'} bg-sidebar fixed left-0 top-0 z-10 transition-all duration-300 ease-in-out`}>
      <div className="flex h-full flex-col">
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gym-red">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">SynergyGym</span>
            </Link>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gym-red mx-auto">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
          )}
          <button
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`sidebar-item ${isActive ? 'active' : ''} ${
                    collapsed ? 'justify-center' : ''
                  } animate-fade-in`}
                  style={{ animationDelay: `${navigationItems.indexOf(item) * 0.05}s` }}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className={`flex ${collapsed ? 'justify-center' : 'items-center'} gap-3`}>
            {!collapsed && (
              <>
                <div className="h-8 w-8 rounded-full bg-gym-blue flex items-center justify-center text-white font-medium">
                  A
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-gray-400">admin@synergygym.com</p>
                </div>
                <LogOut className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </>
            )}
            {collapsed && (
              <div className="h-8 w-8 rounded-full bg-gym-blue flex items-center justify-center text-white font-medium">
                A
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
