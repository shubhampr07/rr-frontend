import React from "react";
import { motion } from "framer-motion";
import { Calendar, CreditCard, Clock, BadgePercent, CircleDollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface SubscriptionAnalyticsProps {
  data: {
    subscriptionMonthly: number;
    commission: number;
    monthsUsing: number;
    totalRevenue: number;
    revenueFromSubscriptions: number;
    revenueFromCommissions: number;
    [key: string]: any;
  };
}

const SubscriptionAnalytics: React.FC<SubscriptionAnalyticsProps> = ({ data }) => {
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

  // Mock subscription history data
  const subscriptionHistory = [
    { date: "Apr 2023", plan: "Basic", amount: 999 },
    { date: "Jul 2023", plan: "Standard", amount: 1999 },
    { date: "Oct 2023", plan: "Premium", amount: 2999 },
    { date: "Jan 2024", plan: "Premium", amount: 2999 },
    { date: "Apr 2024", plan: "Premium", amount: 2999 },
  ];

  // Mock commission history data
  const commissionHistory = [
    { month: "Nov 2023", sales: 180000, commission: 27000 },
    { month: "Dec 2023", sales: 220000, commission: 33000 },
    { month: "Jan 2024", sales: 310000, commission: 46500 },
    { month: "Feb 2024", sales: 425000, commission: 63750 },
    { month: "Mar 2024", sales: 495000, commission: 74250 },
    { month: "Apr 2024", sales: 510000, commission: 76500 },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-slate-200">
                <CreditCard size={18} className="mr-2 text-indigo-400" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gradient-to-br from-indigo-900/30 to-blue-900/30 rounded-xl mb-4 border border-indigo-800/30">
                <div className="flex justify-between items-center mb-4">
                  <div className="bg-indigo-500/20 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-indigo-300">Premium</span>
                  </div>
                  <div className="text-xs text-slate-400">Active</div>
                </div>
                <div className="mb-2">
                  <div className="text-xs text-slate-400 mb-1">Monthly Payment</div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                    ₹{data.subscriptionMonthly.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <Clock size={12} className="mr-1" />
                  <span>Next billing on May 12, 2024</span>
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-400">Plan</div>
                  <div className="text-sm font-medium text-white">Premium</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-400">Commission Rate</div>
                  <div className="text-sm font-medium text-white">{data.commission}%</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-400">Months Using ReferRush</div>
                  <div className="text-sm font-medium text-white">{data.monthsUsing} months</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-slate-400">Total Paid</div>
                  <div className="text-sm font-medium text-emerald-400">
                    ₹{data.referrushCost.subscription.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-slate-200">
                <BadgePercent size={18} className="mr-2 text-blue-400" />
                Commission Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-slate-800/40 p-3 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">Average Commission</div>
                  <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                    ₹{Math.round(data.revenueFromCommissions / 6).toLocaleString()}/mo
                  </div>
                </div>
                <div className="flex-1 bg-slate-800/40 p-3 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">Commission Rate</div>
                  <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                    {data.commission}%
                  </div>
                </div>
                <div className="flex-1 bg-slate-800/40 p-3 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">Total Commissions</div>
                  <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-500">
                    ₹{data.revenueFromCommissions.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm text-slate-300 mb-2 font-medium">Commission History</div>
                {commissionHistory.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/50">
                    <div className="flex items-center">
                      <Calendar size={14} className="text-blue-400 mr-2" />
                      <span className="text-sm text-slate-300">{item.month}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-slate-400">
                        ₹{item.sales.toLocaleString()}
                      </div>
                      <div className="text-sm font-medium text-emerald-400 min-w-24 text-right">
                        ₹{item.commission.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-slate-200">
              <CircleDollarSign size={18} className="mr-2 text-violet-400" />
              Subscription History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-700/50 z-0"></div>
              <div className="space-y-6 relative z-10">
                {subscriptionHistory.map((item, i) => (
                  <div key={i} className="flex items-start ml-6 relative">
                    <div className="absolute -left-6 mt-1 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium text-slate-300">{item.date}</div>
                        <div className="text-sm font-medium text-emerald-400">₹{item.amount}</div>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Upgraded to {item.plan} Plan
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SubscriptionAnalytics; 