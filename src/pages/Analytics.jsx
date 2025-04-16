import { motion } from 'framer-motion';
import { 
  Users, 
  Dumbbell, 
  Timer,
  Award,
  Calendar, 
  Activity,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Shield,
  Smartphone,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import MemberActivity from '../components/dashboard/MemberActivity';
import RevenueChart from '../components/dashboard/RevenueChart';
import RecentMembers from '../components/dashboard/RecentMembers';
import UpcomingClasses from '../components/dashboard/UpcomingClasses';
import { useState, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LabelList
} from 'recharts';

const COLORS = ['#FBB1BD', '#A5F3FC', '#C4B5FD', '#FDE68A', '#6EE7B7', '#FCA5A5'];

const Analytics = () => {
  const [clusters, setClusters] = useState([]);
  const [purchaseGroups, setPurchaseGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentMembers, setRecentMembers] = useState([]);

  useEffect(() => {
    // Fetch clusters.json
    fetch('/clusters.json')
      .then(response => response.json())
      .then(data => {
        setClusters(data.clusters || []);
        setPurchaseGroups(data.purchaseGroups || []);
      })
      .catch(error => {
        console.error('Error fetching clusters.json:', error);
      });

    // Fetch segment.csv and process the first 10 CustomerIDs
    fetch('/segment.csv')
      .then(response => response.text())
      .then(csvText => {
        const rows = csvText.split('\n').filter(row => row.trim() !== ''); // Split into rows and remove empty lines
        const headers = rows[0].split(',').map(header => header.trim()); // Extract headers
        const customerIdIndex = headers.indexOf('CustomerID'); // Find CustomerID column index

        if (customerIdIndex === -1) {
          console.error('CustomerID column not found in segment.csv');
          return;
        }

        const data = rows.slice(1, 11).map(row => {
          const columns = row.split(',').map(col => col.trim());
          return { CustomerID: columns[customerIdIndex] };
        });
        setRecentMembers(data);
      })
      .catch(error => {
        console.error('Error fetching segment.csv:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  // Prepare data for charts
  const clusterData = Object.values(clusters.reduce((acc, { Cluster_ID }) => {
    acc[Cluster_ID] = (acc[Cluster_ID] || 0) + 1;
    return acc;
  }, {})).map((value, index) => ({
    name: `Cluster ${index}`,
    value,
    percentage: ((value / clusters.length) * 100).toFixed(2)
  }));
  const purchaseData = purchaseGroups.map(pg => ({ name: `Cust ${pg.CustomerID}`, totalAmount: pg.totalAmount })).slice(0, 10);

  // Custom label for Pie Chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name}: ${value} (${percentage}%)`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Segmentation Dashboard</h1>
      </div>
      
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Active Customers" 
          value="254" 
          subtitle="↑ 12% increase"
          icon={Users}
          color="purple"
          percent={75}
        />
        <StatCard 
          title="Weekly Purchases" 
          value="189" 
          subtitle="↑ 8% increase"
          icon={Dumbbell}
          color="blue"
          percent={69}
        />
        <StatCard 
          title="Purchase Rate" 
          value="86%" 
          subtitle="↑ 5% increase"
          icon={Timer}
          color="pink"
          percent={86}
        />
        <StatCard 
          title="Retention Rate" 
          value="92%" 
          subtitle="↑ 3% increase"
          icon={Award}
          color="cyan"
          percent={92}
        />
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left section - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Clusters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-card rounded-xl p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg mr-64 font-medium">Cluster of Customers</h3>
              <button>
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="h-72 flex justify-center">
              <PieChart width={800} height={300}>
                <Pie
                  data={clusterData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {clusterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} customers`} />
                <Legend 
                  verticalAlign="bottom" 
                  height={40} 
                  iconSize={12} 
                  wrapperStyle={{ fontSize: '12px', color: '#fff' }}
                />
              </PieChart>
            </div>
          </motion.div>
          
          {/* Customer Grouping Based on Purchases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-card rounded-xl p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Customer Grouping Based on Purchases</h3>
              <button>
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="h-72 flex justify-center">
              <BarChart 
                width={950} 
                height={350} 
                data={purchaseData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60} 
                  interval={0} 
                  tick={{ fontSize: 12, fill: '#fff' }}
                />
                <YAxis tick={{ fill: '#fff' }} />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconSize={10} 
                  wrapperStyle={{ fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="totalAmount" fill="url(#colorUv)">
                  <LabelList 
                    dataKey="totalAmount" 
                    position="top" 
                    fill="#fff" 
                    fontSize={12} 
                    formatter={(value) => `$${value.toFixed(2)}`} 
                  />
                </Bar>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </div>
          </motion.div>
        </div>
        
        {/* Right section - 1/3 width */}
        <div className="lg:col-span-1 space-y-5">
          {/* Segmentation Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="bg-card rounded-xl p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Segmentation Insights</h3>
              <button>
                <MoreVertical size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="group border border-gym-purple/20 rounded-lg p-3 hover:bg-gym-purple/10 transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Cluster Distribution</p>
                    <p className="text-xs text-white/60 mt-1">Even distribution across {clusterData.length} clusters.</p>
                  </div>
                  <ChevronRight size={16} className="text-white/60 group-hover:text-white" />
                </div>
              </div>
              
              <div className="group border border-gym-purple/20 rounded-lg p-3 hover:bg-gym-purple/10 transition-colors cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Top Purchasers</p>
                    <p className="text-xs text-white/60 mt-1">Top 10 customers account for ${purchaseData.reduce((a, b) => a + b.totalAmount, 0).toFixed(2)}.</p>
                  </div>
                  <ChevronRight size={16} className="text-white/60 group-hover:text-white" />
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Recent Members */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="bg-card rounded-xl p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Recent Members</h3>
              <button className="text-sm text-white/60 hover:text-white">View all</button>
            </div>
            <div className="space-y-3">
              {recentMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white">👤</div>
                    <span>{member.CustomerID}</span>
                  </div>
                  <span>-</span> {/* Placeholder for Plan */}
                  <span>-</span> {/* Placeholder for Joined */}
                  <span className="text-green-500">-</span> {/* Placeholder for Status */}
                  <span>...</span> {/* Placeholder for Actions */}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Additional content (empty for now, can add UpcomingClasses if needed) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;