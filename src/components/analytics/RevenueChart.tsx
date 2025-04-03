import React from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart as BarChartIcon, ArrowUpRight } from "lucide-react";

interface RevenueChartProps {
  data: {
    totalRevenue: number;
    revenueFromSubscriptions: number;
    revenueFromCommissions: number;
    [key: string]: any;
  };
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  // Mock monthly data for visualization
  const chartData = [
    { month: "Jan", subscriptions: 16000, commissions: 32000 },
    { month: "Feb", subscriptions: 15000, commissions: 34000 },
    { month: "Mar", subscriptions: 16500, commissions: 38000 },
    { month: "Apr", subscriptions: 16000, commissions: 42000 },
    { month: "May", subscriptions: 17500, commissions: 45000 },
    { month: "Jun", subscriptions: 18000, commissions: 50000 },
  ];

  // Custom tooltip component to remove the white background
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded p-2 shadow-md">
          <p className="text-slate-400 text-xs mb-1">{`Month: ${label}`}</p>
          <p className="text-indigo-300 text-xs font-medium">
            {`Subscriptions: ₹${payload[0].value.toLocaleString()}`}
          </p>
          <p className="text-blue-300 text-xs font-medium">
            {`Commissions: ₹${payload[1].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center text-slate-200">
            <BarChartIcon size={18} className="mr-2 text-indigo-400" />
            Revenue Trend
          </CardTitle>
          <div className="text-xs text-slate-400 flex items-center">
            <span className="text-emerald-400 mr-1">+12.5%</span>
            <ArrowUpRight size={14} className="text-emerald-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-full">
          <div className="flex justify-between mb-2">
            <div className="text-sm text-slate-400">Monthly Revenue (Last 6 Months)</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                <span className="text-xs text-slate-400">Subscriptions</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                <span className="text-xs text-slate-400">Commissions</span>
              </div>
            </div>
          </div>

          <div className="w-full h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={2}>
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(15, 23, 42, 0.3)' }} />
                <Bar 
                  dataKey="subscriptions" 
                  fill="#818cf8" // Lighter indigo
                  radius={[3, 3, 0, 0]} 
                />
                <Bar 
                  dataKey="commissions" 
                  fill="#0ea5e9" // Sky blue
                  radius={[3, 3, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-800/40 p-3 rounded-lg">
              <div className="text-xs text-slate-400 mb-1">Subscriptions</div>
              <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-400">
                ₹{data.revenueFromSubscriptions.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-400 flex items-center mt-1">
                +8.3% <ArrowUpRight size={12} className="ml-1" />
              </div>
            </div>
            <div className="bg-slate-800/40 p-3 rounded-lg">
              <div className="text-xs text-slate-400 mb-1">Commissions</div>
              <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-sky-500">
                ₹{data.revenueFromCommissions.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-400 flex items-center mt-1">
                +14.2% <ArrowUpRight size={12} className="ml-1" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;