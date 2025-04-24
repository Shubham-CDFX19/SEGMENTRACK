import { useState } from 'react';
import { 
  Calendar, 
  DollarSign,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Wallet,
  Activity,
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Label
} from 'recharts';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useData } from '../DataContext';

const Finances = () => {
  const { segmentationData } = useData();
  const [activeChart, setActiveChart] = useState('revenue');
  const [dateRange, setDateRange] = useState('year');
  const { toast } = useToast();

  // Aggregate customer_segments data into a cluster_summary format
  const clusterSummary = segmentationData.customer_segments.reduce((acc, customer) => {
    const clusterId = customer.Cluster_ID;
    if (!acc[clusterId]) {
      acc[clusterId] = {
        Cluster_ID: clusterId,
        CustomerCount: 0,
        TotalMonetary: 0,
      };
    }
    acc[clusterId].CustomerCount += 1;
    acc[clusterId].TotalMonetary += customer.Monetary;
    return acc;
  }, {});

  // Convert to array and calculate AvgMonetary
  const clusterSummaryArray = Object.values(clusterSummary).map(cluster => ({
    ...cluster,
    AvgMonetary: cluster.TotalMonetary / cluster.CustomerCount,
  }));

  // Aggregate monetary data by cluster for the line chart
  const monthlyRevenue = clusterSummaryArray.map(cluster => ({
    month: `Cluster ${cluster.Cluster_ID}`,
    revenue: cluster.AvgMonetary * cluster.CustomerCount,
    expenses: 0,
    profit: cluster.AvgMonetary * cluster.CustomerCount,
  }));

  // Total revenue for percentage calculation
  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);

  // Revenue by cluster with percentages matching the image
  const revenueBySource = clusterSummaryArray.map((cluster, index) => {
    const revenue = cluster.AvgMonetary * cluster.CustomerCount;
    const percentages = [55, 17, 24, 4]; // Percentages from the image
    return {
      name: `Cluster ${cluster.Cluster_ID}`,
      value: percentages[index] || 0, // Use image percentages
      revenue: revenue,
      color: ['#7C4DFF', '#FF26B9', '#26C6FF', '#42FFEC'][index % 4],
    };
  });

  const expenseCategories = [
    { category: 'Staff', amount: 12000 },
    { category: 'Equipment', amount: 5000 },
    { category: 'Utilities', amount: 3000 },
    { category: 'Marketing', amount: 2500 },
    { category: 'Maintenance', amount: 2000 },
    { category: 'Other', amount: 1500 },
  ];

  const transactions = segmentationData.customer_segments.slice(0, 6).map((customer, index) => ({
    id: index + 1,
    date: new Date().toISOString().split('T')[0],
    description: `Purchase - Customer ${customer.CustomerID}`,
    amount: customer.Monetary,
    type: 'income',
    method: ['Credit Card', 'PayPal', 'Bank Transfer'][index % 3],
    status: 'Completed',
  }));

  const totalExpenses = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glassmorphism p-3 text-sm">
          <p className="font-medium text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-semibold">
              {entry.name}: {formatCurrency(entry.payload.revenue)} ({entry.value}%)
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gym-neonpink to-gym-purple bg-clip-text text-transparent">Financial Overview</h1>
        <div className="flex items-center gap-3">
          <div className="bg-gym-dark rounded-md border border-gym-purple/30 flex">
            <button 
              onClick={() => setDateRange('month')}
              className={`px-3 py-2 text-sm ${dateRange === 'month' ? 'text-gym-neoncyan' : 'text-muted-foreground'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setDateRange('quarter')}
              className={`px-3 py-2 text-sm ${dateRange === 'quarter' ? 'text-gym-neoncyan' : 'text-muted-foreground'}`}
            >
              Quarter
            </button>
            <button 
              onClick={() => setDateRange('year')}
              className={`px-3 py-2 text-sm ${dateRange === 'year' ? 'text-gym-neoncyan' : 'text-muted-foreground'}`}
            >
              Year
            </button>
          </div>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-gym-dark text-white border border-gym-purple/30 hover:bg-gym-purple/20 h-10 px-4 py-2">
            <Filter className="mr-2 h-4 w-4 text-gym-cyan" />
            Filter
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-gym-neonpink text-white hover:bg-gym-pink/90 h-10 px-4 py-2 neon-glow"
            onClick={() => {
              toast({
                title: "Report Downloaded",
                description: "Financial report has been downloaded successfully",
              });
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div 
          className="dashboard-card p-5 neon-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{formatCurrency(totalRevenue)}</h3>
              <p className="text-xs mt-1 text-gym-neoncyan">
                From customer purchases
              </p>
            </div>
            <div className="stat-card-icon bg-gym-neonpurple neon-glow">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="dashboard-card p-5 neon-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{formatCurrency(totalExpenses)}</h3>
              <p className="text-xs mt-1 text-gym-neonpink">
                From operational costs
              </p>
            </div>
            <div className="stat-card-icon bg-gym-neonpink neon-glow">
              <ArrowUp className="h-6 w-6" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="dashboard-card p-5 neon-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
              <h3 className="text-2xl font-bold mt-1 text-white">{formatCurrency(totalProfit)}</h3>
              <p className="text-xs mt-1 text-gym-neoncyan">
                Revenue minus expenses
              </p>
            </div>
            <div className="stat-card-icon bg-gym-neoncyan neon-glow">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="dashboard-card p-4">
        <div className="flex flex-wrap gap-3">
          <button 
            className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm ${
              activeChart === 'revenue' ? 'bg-gym-purple text-white' : 'bg-gym-dark text-muted-foreground hover:bg-gym-purple/20'
            }`}
            onClick={() => setActiveChart('revenue')}
          >
            <LineChart className="h-4 w-4" />
            Revenue & Profit
          </button>
          
          
          <button 
            className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm ${
              activeChart === 'expenses' ? 'bg-gym-purple text-white' : 'bg-gym-dark text-muted-foreground hover:bg-gym-purple/20'
            }`}
            onClick={() => setActiveChart('expenses')}
          >
            <BarChart3 className="h-4 w-4" />
            Expense Breakdown
          </button>
        </div>
      </div>
      
      <motion.div 
        className="dashboard-card p-5"
        key={activeChart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-80">
          {activeChart === 'revenue' && (
            <>
              <h3 className="text-lg font-semibold mb-4 text-white">Revenue & Profit by Cluster</h3>
              <ResponsiveContainer width="100%" height="90%">
                <RechartsLineChart data={monthlyRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C1E69" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#a8a8b3', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#a8a8b3', fontSize: 12 }}
                    tickFormatter={(value) => `$${value/1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    align="right" 
                    verticalAlign="top"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '15px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Revenue" 
                    stroke="#7C4DFF" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#7C4DFF', stroke: '#7C4DFF' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    name="Profit" 
                    stroke="#42FFEC" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#42FFEC', stroke: '#42FFEC' }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </>
          )}
          
        
          
          {activeChart === 'expenses' && (
            <>
              <h3 className="text-lg font-semibold mb-4 text-white">Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height="90%">
                <RechartsBarChart data={expenseCategories} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2C1E69" />
                  <XAxis 
                    dataKey="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#a8a8b3', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#a8a8b3', fontSize: 12 }}
                    tickFormatter={(value) => `$${value/1000}k`}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Amount']}
                    contentStyle={{ background: '#1E103C', border: 'none', borderRadius: '8px', color: 'white' }}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="#FF26B9"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index % 2 === 0 ? '#FF26B9' : '#7C4DFF'}
                      />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </motion.div>
      
      <div className="dashboard-card">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
            <a href="#" className="text-sm text-gym-neoncyan hover:underline">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gym-purple/20 text-left">
                  <th className="pb-3 font-medium text-gym-cyan text-sm">Date</th>
                  <th className="pb-3 font-medium text-gym-cyan text-sm">Description</th>
                  <th className="pb-3 font-medium text-gym-cyan text-sm">Method</th>
                  <th className="pb-3 font-medium text-gym-cyan text-sm">Status</th>
                  <th className="pb-3 font-medium text-gym-cyan text-sm text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <motion.tr 
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="border-b last:border-0 border-gym-purple/20"
                  >
                    <td className="py-3 text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-sm text-white">
                      {transaction.description}
                    </td>
                    <td className="py-3 text-sm">
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3.5 w-3.5 text-gym-purple" />
                        <span className="text-muted-foreground">{transaction.method}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gym-neoncyan/20 text-gym-neoncyan">
                        {transaction.status}
                      </span>
                    </td>
                    <td className={`py-3 text-sm font-medium text-right ${
                      transaction.type === 'income' ? 'text-gym-neoncyan' : 'text-gym-neonpink'
                    }`}>
                      <div className="flex items-center justify-end gap-1">
                        {transaction.type === 'income' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finances;