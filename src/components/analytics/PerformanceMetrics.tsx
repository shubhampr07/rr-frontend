import React from "react";
import { motion } from "framer-motion";
import { LineChart, BarChart3, PieChart, TrendingUp, Sparkles, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface PerformanceMetricsProps {
  data: {
    totalRevenue: number;
    salesGenerated: number;
    percentOfTotalSales: number;
    totalCosts: number;
    roi: number;
    [key: string]: any;
  };
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data }) => {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Mock performance data for merchants
  const merchantPerformance = [
    { name: "Fashion Store", sales: 540000, roi: 5.2, percent: 25 },
    { name: "Electronics Hub", sales: 420000, roi: 4.8, percent: 19 },
    { name: "Home Decor", sales: 380000, roi: 4.5, percent: 17 },
    { name: "Sports Gear", sales: 320000, roi: 3.7, percent: 15 },
    { name: "Beauty Shop", sales: 280000, roi: 3.2, percent: 13 },
    { name: "Food Delivery", sales: 200000, roi: 2.8, percent: 11 },
  ];

  // Monthly ROI data for Recharts
  const roiChartData = [
    { month: "Nov", roi: 3.2 },
    { month: "Dec", roi: 3.5 },
    { month: "Jan", roi: 3.8 },
    { month: "Feb", roi: 4.1 },
    { month: "Mar", roi: 4.5 },
    { month: "Apr", roi: 4.8 }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-2 rounded border border-slate-700 text-xs">
          <p className="text-slate-200">{`${payload[0].value}x`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-slate-200">
                <LineChart size={18} className="mr-2 text-indigo-400" />
                ROI Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Current ROI</div>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                    {data.roi.toFixed(1)}x
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-slate-800/40 p-3 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">Target</div>
                    <div className="text-sm font-medium text-indigo-300">5.0x</div>
                  </div>
                  <div className="bg-slate-800/40 p-3 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">Growth</div>
                    <div className="text-sm font-medium text-emerald-400">+0.3x/mo</div>
                  </div>
                </div>
              </div>
              
              {/* Recharts ROI Chart - Replace the custom bar chart */}
              <div className="h-52 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roiChartData}>
                    <defs>
                      <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 6]} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      tickFormatter={(value) => `${value}x`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(15, 23, 42, 0.3)' }}/>
                    <Bar 
                      dataKey="roi" 
                      fill="url(#roiGradient)" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={50}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 bg-slate-800/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-slate-300 font-medium flex items-center">
                    <Sparkles size={16} className="mr-2 text-indigo-400" />
                    ROI Analysis
                  </div>
                  <div className="text-xs text-emerald-400 flex items-center">
                    <TrendingUp size={14} className="mr-1" />
                    Increasing
                  </div>
                </div>
                <p className="text-sm text-slate-400">
                  Your ROI has increased by 15% in the last quarter. Continue optimizing your referral campaigns to reach the target ROI of 5.0x.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-slate-200">
                <PieChart size={18} className="mr-2 text-indigo-400" />
                Sales Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center my-4">
                <div className="relative w-40 h-40">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="20"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="url(#salesGradient)"
                      strokeWidth="20"
                      strokeDasharray="439.8"
                      initial={{ strokeDashoffset: 439.8 }}
                      animate={{ 
                        strokeDashoffset: 439.8 - (439.8 * data.percentOfTotalSales / 100)
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      transform="rotate(-90 80 80)"
                    />
                    <defs>
                      <linearGradient id="salesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                      {data.percentOfTotalSales}%
                    </span>
                    <span className="text-xs text-slate-400">of total sales</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="text-slate-400">ReferRush Sales</div>
                  <div className="font-medium text-indigo-300">
                    ₹{data.salesGenerated.toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-slate-400">Other Sales</div>
                  <div className="font-medium text-slate-300">
                    ₹{(data.salesGenerated / data.percentOfTotalSales * (100 - data.percentOfTotalSales)).toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-700/30 mt-2">
                  <div className="text-slate-400">Total Business Sales</div>
                  <div className="font-medium text-white">
                    ₹{(data.salesGenerated / data.percentOfTotalSales * 100).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div variants={itemVariants}>
        <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-slate-200">
              <BarChart3 size={18} className="mr-2 text-indigo-400" />
              Merchant Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Merchant</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-slate-400">Sales</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-slate-400">% of Total</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-slate-400">ROI</th>
                    <th className="text-right py-3 px-2 text-sm font-medium text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {merchantPerformance.map((merchant, i) => (
                    <tr key={i} className="border-b border-slate-700/30 hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-2 text-sm font-medium text-slate-300">{merchant.name}</td>
                      <td className="py-3 px-2 text-sm text-right font-medium text-slate-300">
                        ₹{merchant.sales.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-sm text-right">
                        <div className="inline-block bg-blue-500/20 rounded-full px-2 py-1 text-xs text-blue-300">
                          {merchant.percent}%
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-right font-medium text-emerald-400">
                        {merchant.roi.toFixed(1)}x
                      </td>
                      <td className="py-3 px-2 text-sm text-right">
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded-full text-xs text-emerald-300">
                          <CheckCircle size={12} />
                          <span>Performing</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PerformanceMetrics;