
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3,
  Dumbbell,
  AlertTriangle,
  Shield,
  Smartphone,
  MoreVertical,
  ChevronRight
} from 'lucide-react';

// Import dashboard components
import StatCard from '../components/dashboard/StatCard';
import MemberActivity from '../components/dashboard/MemberActivity';
import RevenueChart from '../components/dashboard/RevenueChart';
import ClassesOverview from '../components/dashboard/ClassesOverview';
import RecentMembers from '../components/dashboard/RecentMembers';
import UpcomingClasses from '../components/dashboard/UpcomingClasses';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="High-risk events" 
          value="29" 
          subtitle="57% total"
          icon={AlertTriangle}
          color="purple"
          percent={57}
        />
        <StatCard 
          title="Risky activities" 
          value="08" 
          subtitle="32% total"
          icon={Shield}
          color="blue"
          percent={32}
        />
        <StatCard 
          title="High-risk User" 
          value="06" 
          subtitle="17% total"
          icon={Users}
          color="pink"
          percent={17}
        />
        <StatCard 
          title="Devices with issues" 
          value="01" 
          subtitle="3% total"
          icon={Smartphone}
          color="cyan"
          percent={3}
        />
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left section - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Files in time chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-card rounded-xl p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Files in time</h3>
              <p className="text-sm font-medium text-blue-500">$3,900</p>
            </div>
            <div className="h-72">
              <RevenueChart />
            </div>
          </motion.div>
          
          {/* Two columns for Learn and Report */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-card rounded-xl p-5"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Learn to use SynergyGym</h3>
                <button>
                  <MoreVertical size={16} />
                </button>
              </div>
              
              {/* Learning sections */}
              <div className="space-y-3">
                <div className="border border-gym-purple/20 rounded-lg p-3 hover:bg-gym-purple/10 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">What are your fitness goals?</p>
                    <ChevronRight size={16} />
                  </div>
                </div>
                <div className="border border-gym-purple/20 rounded-lg p-3 hover:bg-gym-purple/10 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Building consistent workouts</p>
                    <ChevronRight size={16} />
                  </div>
                </div>
                <div className="border border-gym-purple/20 rounded-lg p-3 hover:bg-gym-purple/10 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Optimize training plans</p>
                    <ChevronRight size={16} />
                  </div>
                </div>
                <div className="border border-gym-purple/20 rounded-lg p-3 hover:bg-gym-purple/10 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Maximizing recovery sessions</p>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-card rounded-xl p-5"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Get one-time report</h3>
                <button>
                  <MoreVertical size={16} />
                </button>
              </div>
              
              <div className="py-4">
                <div className="h-32 w-full">
                  <MemberActivity />
                </div>
              </div>
              
              <div className="flex space-x-2 overflow-x-auto py-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <button
                    key={i}
                    className={`flex-shrink-0 h-7 w-7 rounded-md flex items-center justify-center text-xs ${
                      i === 3 ? 'bg-gym-purple text-white' : 'bg-gym-purple/20 text-white/70 hover:bg-gym-purple/30'
                    }`}
                  >
                    {i + 21}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Right section - 1/3 width */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="bg-card rounded-xl p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Environment settings</h3>
              <button>
                <MoreVertical size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="group border border-gym-purple/20 rounded-lg p-3 hover:bg-gym-purple/10 transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Email notifications</p>
                    <p className="text-xs text-white/60 mt-1">Receive email notifications for daily events to be informed.</p>
                  </div>
                  <ChevronRight size={16} className="text-white/60 group-hover:text-white" />
                </div>
              </div>
              
              <div className="group border border-gym-purple/20 rounded-lg p-3 hover:bg-gym-purple/10 transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Devices with issues</p>
                    <p className="text-xs text-white/60 mt-1">41 devices with biometric no devices to fingerprint full version of events.</p>
                  </div>
                  <ChevronRight size={16} className="text-white/60 group-hover:text-white" />
                </div>
              </div>
              
              <div className="group border border-gym-purple/20 rounded-lg p-3 hover:bg-gym-purple/10 transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Investigations</p>
                    <p className="text-xs text-white/60 mt-1">Leverage investigations to faster discover and evaluate potential types of events.</p>
                  </div>
                  <ChevronRight size={16} className="text-white/60 group-hover:text-white" />
                </div>
              </div>
              
              <div className="group border border-gym-purple/20 rounded-lg p-3 hover:bg-gym-purple/10 transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Reporting</p>
                    <p className="text-xs text-white/60 mt-1">Activate the weekly report to monitor user activities and increase security measures.</p>
                  </div>
                  <ChevronRight size={16} className="text-white/60 group-hover:text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Additional content (can be toggled) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <RecentMembers />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <UpcomingClasses />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
