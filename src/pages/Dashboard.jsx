
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3,
  Dumbbell,
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
      <h1 className="text-3xl font-bold">Welcome to SynergyGym</h1>
      
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total Members" 
          value="2,548" 
          icon={Users} 
          iconBg="bg-gym-blue"
          change="12%"
          changeText="from last month"
          changeType="positive"
        />
        <StatCard 
          title="Classes Today" 
          value="24" 
          icon={Calendar} 
          iconBg="bg-gym-green"
          change="8"
          changeText="more than yesterday"
          changeType="positive"
        />
        <StatCard 
          title="Monthly Revenue" 
          value="$34,580" 
          icon={DollarSign} 
          iconBg="bg-gym-red"
          change="7.3%"
          changeText="from last month"
          changeType="positive"
        />
        <StatCard 
          title="Active Trainers" 
          value="18" 
          icon={Dumbbell} 
          iconBg="bg-gym-darkblue"
          change="2"
          changeText="new this month"
          changeType="positive"
        />
      </div>
      
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <RevenueChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <MemberActivity />
        </motion.div>
      </div>
      
      {/* Bottom section with tables/lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <RecentMembers />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <ClassesOverview />
        </motion.div>
      </div>
      
      {/* Upcoming classes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <UpcomingClasses />
      </motion.div>
    </div>
  );
};

export default Dashboard;
