
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  DollarSign, 
  AudioWaveform, 
  Menu, 
  X,
  LogOut,
  BarChart3,
  ShieldAlert,
  ServerCog,
  UserCheck,
  Database,
  Monitor
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Customers', path: '/members', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Finances', path: '/finances', icon: DollarSign },
  ];

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'application/json' || file.type === 'text/csv')) {
      setSelectedFile(file);
    } else {
      alert('Please upload a JSON or CSV file.');
      event.target.value = '';
      setSelectedFile(null);
    }
  };

  return (
    <div className={`h-screen ${collapsed ? 'w-20' : 'w-64'} bg-gym-purpleSidebar fixed left-0 top-0 z-10 transition-all duration-300 ease-in-out`}>
      <div className="flex h-full flex-col">
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gym-purpleLight/20">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gym-purpleProgress">
                <AudioWaveform className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">SegmenTrack</span>
            </Link>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gym-purpleProgress mx-auto">
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

        {/* Search bar - similar to the image */}
        {!collapsed && (
          <div className="px-4 pt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gym-purpleDeep text-white text-sm rounded-full border border-gym-purpleLight/20 px-3 py-2 pl-8 focus:outline-none focus:ring-1 focus:ring-gym-purpleLight/50"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Menu Section Label */}
        {!collapsed && (
          <div className="px-4 pt-6 pb-2">
            <p className="text-xs uppercase text-gray-400 font-medium">Menu</p>
          </div>
        )}

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
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-gym-purpleHighlight' : 'text-gray-400'}`} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Manage Section */}
          {!collapsed && (
            <div className="mt-8">
              <div className="px-4 pb-2">
                <p className="text-xs uppercase text-gray-400 font-medium">Manage</p>
              </div>
              <nav className="space-y-1">
                <div className="sidebar-item">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="file"
                      accept=".json,.csv"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <span className="flex items-center">
                      <Database className="h-5 w-5 text-gray-400 mr-2" />
                      <span>Upload File (JSON/CSV)</span>
                    </span>
                  </label>
                </div>
                {selectedFile && (
                  <div className="px-4 text-sm text-gray-300">
                    Selected File: {selectedFile.name}
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>


        {/* Sidebar footer */}
        <div className="border-t border-gym-purpleLight/20 p-4">
          <div className={`flex ${collapsed ? 'justify-center' : 'items-center'} gap-3`}>
            {!collapsed && (
              <>
                <div className="h-8 w-8 rounded-full bg-gym-purpleProgress flex items-center justify-center text-white font-medium">
                  A
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-gray-400">admin@gmail.com</p>
                </div>
                <LogOut className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </>
            )}
            {collapsed && (
              <div className="h-8 w-8 rounded-full bg-gym-purpleProgress flex items-center justify-center text-white font-medium">
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
