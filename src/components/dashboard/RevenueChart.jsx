
import { useState } from 'react';
import {
  AreaChart,
  Area,
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
  const gradientId = "colorRevenue";
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/10 backdrop-blur-md p-3 text-sm rounded-lg border border-white/20 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-400 font-bold mt-1">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="month" 
          axisLine={false} 
          tickLine={false}
          tick={{ fontSize: 10, fill: "#718096" }}
        />
        <YAxis 
          hide={true}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="#8884d8" 
          fillOpacity={1} 
          fill={`url(#${gradientId})`}
          strokeWidth={2}
          activeDot={{ r: 6, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
