import { motion } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
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
import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LabelList,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useData } from '../DataContext';

const COLORS = ['#A5F3FC', '#FBB1BD', '#FDE68A', '#C4B5FD', '#6EE7B7'];

const Analytics = () => {
  const { segmentationData } = useData();
  const [loading, setLoading] = useState(false);

  // Transform cluster data for the horizontal bar chart
  const clusterData = segmentationData.cluster_summary.map(cluster => ({
    name: `Cluster ${cluster.Cluster_ID}`,
    value: cluster.CustomerCount
  }));

  const purchaseData = segmentationData.customer_segments
    .sort((a, b) => b.Monetary - a.Monetary)
    .slice(0, 10)
    .map(customer => ({
      name: `Cust ${customer.CustomerID}`,
      totalAmount: customer.Monetary
    }));

  const recentMembers = segmentationData.customer_segments
    .sort((a, b) => a.Recency - b.Recency)
    .slice(0, 10)
    .map(customer => ({
      CustomerID: customer.CustomerID
    }));

  const activeCustomers = segmentationData.customer_segments.filter(c => c.Recency <= 30).length;
  const weeklyPurchases = segmentationData.customer_segments.filter(c => c.Recency <= 7).length;
  const purchaseRate = segmentationData.customer_segments.length > 0 
    ? ((weeklyPurchases / segmentationData.customer_segments.length) * 100).toFixed(0)
    : 0;
  const retentionRate = segmentationData.customer_segments.length > 0 
    ? ((segmentationData.customer_segments.filter(c => c.Frequency > 1).length / segmentationData.customer_segments.length) * 100).toFixed(0)
    : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E103C] p-3 rounded-lg shadow-lg border border-gym-purple/30">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-gym-neoncyan">
              {entry.name}: {entry.value} customers
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Segmentation Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Active Customers" 
          value={activeCustomers} 
          subtitle="Customers with purchases in last 30 days"
          icon={Users}
          color="purple"
          percent={segmentationData.customer_segments.length > 0 ? (activeCustomers / segmentationData.customer_segments.length * 100).toFixed(0) : 0}
        />
        <StatCard 
          title="Weekly Purchases" 
          value={weeklyPurchases} 
          subtitle="Purchases in last 7 days"
          icon={ShoppingBag}
          color="blue"
          percent={segmentationData.customer_segments.length > 0 ? (weeklyPurchases / segmentationData.customer_segments.length * 100).toFixed(0) : 0}
        />
        <StatCard 
          title="Purchase Rate" 
          value={`${purchaseRate}%`} 
          subtitle="Customers purchasing weekly"
          icon={Timer}
          color="pink"
          percent={purchaseRate}
        />
        <StatCard 
          title="Retention Rate" 
          value={`${retentionRate}%`} 
          subtitle="Customers with multiple purchases"
          icon={Award}
          color="cyan"
          percent={retentionRate}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-card rounded-xl p-5 shadow-[0_0_20px_rgba(138,43,226,0.5)]"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg mr-64 font-medium">Cluster Customer Counts</h3>
              <button>
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="h-96 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={clusterData} 
                  layout="vertical" // Horizontal bars
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis 
                    type="number" 
                    tick={{ fill: '#fff', fontSize: 12 }} 
                    domain={[0, 'dataMax + 50']} // Extend the axis slightly beyond the max value
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fill: '#fff', fontSize: 12 }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[0, 10, 10, 0]} // Rounded ends on the right
                    isAnimationActive={true}
                    animationDuration={1000} // Smooth animation
                  >
                    {clusterData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                    <LabelList 
                      dataKey="value" 
                      position="right" 
                      fill="#fff" 
                      fontSize={12} 
                      formatter={(value) => `${value} customers`} 
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-card rounded-xl p-5 shadow-[0_0_20px_rgba(138,43,226,0.5)]"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Customer Grouping Based on Purchases</h3>
              <button>
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="h-72 flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
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
                  <YAxis tick={{ fill: '#fff', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconSize={10} 
                    wrapperStyle={{ fontSize: '12px', color: '#fff' }}
                  />
                  <Bar 
                    dataKey="totalAmount" 
                    fill="url(#colorUv)" 
                    radius={[10, 10, 0, 0]}
                  >
                    {purchaseData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#colorUv-${index})`}
                      />
                    ))}
                    <LabelList 
                      dataKey="totalAmount" 
                      position="top" 
                      fill="#fff"
                      fontSize={12} 
                      formatter={(value) => `$${value.toFixed(2)}`} 
                      style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                        padding: '2px 4px', 
                        borderRadius: '4px' 
                      }}
                    />
                    <motion.path
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </Bar>
                  <defs>
                    {purchaseData.map((_, index) => (
                      <linearGradient key={`colorUv-${index}`} id={`colorUv-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.3}/>
                      </linearGradient>
                    ))}
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
        
        <div className="lg:col-span-1 space-y-5">
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
                    <p className="text-xs text-white/60 mt-1">Distribution across {segmentationData.cluster_summary.length} clusters.</p>
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
                  <span>Cluster {segmentationData.customer_segments.find(c => c.CustomerID === member.CustomerID)?.Cluster_ID}</span>
                  <span>{segmentationData.customer_segments.find(c => c.CustomerID === member.CustomerID)?.Recency} days ago</span>
                  <span className="text-green-500">Active</span>
                  <span>...</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;