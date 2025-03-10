
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', revenue: 15000 },
  { month: 'Feb', revenue: 18000 },
  { month: 'Mar', revenue: 16500 },
  { month: 'Apr', revenue: 17500 },
  { month: 'May', revenue: 21000 },
  { month: 'Jun', revenue: 23500 },
  { month: 'Jul', revenue: 22000 },
  { month: 'Aug', revenue: 24500 },
  { month: 'Sep', revenue: 26000 },
  { month: 'Oct', revenue: 29000 },
  { month: 'Nov', revenue: 31000 },
  { month: 'Dec', revenue: 34000 },
];

const RevenueChart = () => {
  const formatYAxis = (value) => {
    if (value >= 1000) {
      return `$${value / 1000}k`;
    }
    return `$${value}`;
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glassmorphism p-3 text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-gym-green font-bold mt-1">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Revenue Overview</h3>
        <span className="text-sm text-gym-green font-medium">+15% yearly growth</span>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4CAF50"
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
