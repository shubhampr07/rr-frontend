import React from "react";
import { motion } from "framer-motion";
import { Store, ShoppingBag, Users, TrendingUp, Activity, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface MerchantAnalyticsProps {
  data: {
    salesGenerated: number;
    [key: string]: any;
  };
}

const MerchantAnalytics: React.FC<MerchantAnalyticsProps> = ({ data }) => {
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

  // Mock merchant data
  const merchants = [
    { 
      id: 1, 
      name: "Fashion Store", 
      sales: 540000, 
      customers: 1240, 
      orders: 2850, 
      growth: 18.5 
    },
    { 
      id: 2, 
      name: "Electronics Hub", 
      sales: 420000, 
      customers: 980, 
      orders: 1950, 
      growth: 15.2 
    },
    { 
      id: 3, 
      name: "Home Decor", 
      sales: 380000, 
      customers: 820, 
      orders: 1680, 
      growth: 12.8 
    },
    { 
      id: 4, 
      name: "Sports Gear", 
      sales: 320000, 
      customers: 720, 
      orders: 1480, 
      growth: 10.5 
    },
  ];

  // Function to get sales percentage of total
  const getSalesPercentage = (merchantSales: number) => {
    return ((merchantSales / data.salesGenerated) * 100).toFixed(1);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div variants={itemVariants} className="col-span-full">
          <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-slate-200">
                <Store size={18} className="mr-2 text-indigo-400" />
                Top Performing Merchants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {merchants.map((merchant) => (
                  <div key={merchant.id} className="bg-slate-800/30 rounded-lg p-4 transition-all hover:bg-slate-800/50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-md font-medium text-slate-200">{merchant.name}</h3>
                        <div className="flex items-center mt-1 text-xs text-slate-400">
                          <TrendingUp size={12} className="text-emerald-400 mr-1" />
                          <span className="text-emerald-400 mr-1">{merchant.growth}%</span>
                          <span>growth this quarter</span>
                        </div>
                      </div>
                      <div className="bg-indigo-500/20 px-2 py-1 rounded text-xs text-indigo-300">
                        {getSalesPercentage(merchant.sales)}% of sales
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-800/50 rounded p-2">
                        <div className="flex items-center mb-1">
                          <ShoppingBag size={12} className="text-indigo-400 mr-1" />
                          <span className="text-xs text-slate-400">Sales</span>
                        </div>
                        <div className="text-sm font-medium text-white">₹{merchant.sales.toLocaleString()}</div>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded p-2">
                        <div className="flex items-center mb-1">
                          <Users size={12} className="text-blue-400 mr-1" />
                          <span className="text-xs text-slate-400">Customers</span>
                        </div>
                        <div className="text-sm font-medium text-white">{merchant.customers.toLocaleString()}</div>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded p-2">
                        <div className="flex items-center mb-1">
                          <Activity size={12} className="text-emerald-400 mr-1" />
                          <span className="text-xs text-slate-400">Orders</span>
                        </div>
                        <div className="text-sm font-medium text-white">{merchant.orders.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Sales Progress</span>
                        <span>{getSalesPercentage(merchant.sales)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${getSalesPercentage(merchant.sales)}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
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
              <BarChart size={18} className="mr-2 text-indigo-400" />
              Monthly Merchant Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/30 p-4 rounded-lg">
                <div className="text-sm text-slate-400 mb-2">Top Performing Month</div>
                <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">April 2024</div>
                <div className="flex items-center mt-1 text-xs text-emerald-400">
                  <TrendingUp size={12} className="mr-1" />
                  <span>+22.5% growth</span>
                </div>
              </div>
              
              <div className="bg-slate-800/30 p-4 rounded-lg">
                <div className="text-sm text-slate-400 mb-2">Most Improved Merchant</div>
                <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Electronics Hub</div>
                <div className="flex items-center mt-1 text-xs text-emerald-400">
                  <TrendingUp size={12} className="mr-1" />
                  <span>+28.7% month-over-month</span>
                </div>
              </div>
              
              <div className="bg-slate-800/30 p-4 rounded-lg">
                <div className="text-sm text-slate-400 mb-2">Overall Growth</div>
                <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">+15.3%</div>
                <div className="text-xs text-slate-400 mt-1">
                  Quarter-over-quarter improvement
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
              <p className="text-sm text-slate-400">
                The top merchants have shown consistent growth over the past quarter. Fashion Store continues to lead with the highest sales volume, while Electronics Hub has shown the most significant improvement. Focus on expanding these high-performing merchants to maximize your revenue.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MerchantAnalytics; 