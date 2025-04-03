import React, { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, BarChart, ArrowUpRight, Timer, CreditCard, Users, CalendarClock, DollarSign, PercentCircle, LineChart, WalletCards, BadgePercent, ScanSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ROICard from "./ROICard";
import RevenueChart from "./RevenueChart";
import SubscriptionAnalytics from "./SubscriptionAnalytics";
import PerformanceMetrics from "./PerformanceMetrics";
import MerchantAnalytics from "./MerchantAnalytics";
import AnalyticsModal from "../AnalyticsModal";


// Mock data
const mockAnalyticsData = {
  freeTrialStatus: "Active", // or "Expired" or "Not Started"
  plan: "Premium",
  subscriptionMonthly: 2999,
  commission: 15, // percentage
  monthsUsing: 8,
  totalRevenue: 456000,
  revenueFromSubscriptions: 135000,
  revenueFromCommissions: 321000,
  salesGenerated: 2140000,
  percentOfTotalSales: 32,
  totalCosts: 89000,
  referrushCost: {
    subscription: 24000,
    commission: 65000,
  },
  whatsappCost: 12000,
  payoutsCost: 8000,
  roi: 4.8,
};

const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  
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

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">
            Business Analytics
          </h2>
          <p className="text-slate-400">Comprehensive view of your business performance</p>
        </div>
        <Button 
          variant="outline" 
          className="bg-slate-900/50 border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-all gap-2"
          onClick={() => setShowAnalyticsModal(true)}
        >
          <ScanSearch size={16} />
          View All Analytics
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-slate-900/70 border border-slate-700 mb-6 p-1">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-800/70 data-[state=active]:to-blue-800/70 data-[state=active]:text-white data-[state=active]:shadow-md py-2 px-4"
          >
            <PieChart size={16} className="mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="revenue" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-800/70 data-[state=active]:to-blue-800/70 data-[state=active]:text-white data-[state=active]:shadow-md py-2 px-4"
          >
            <BarChart size={16} className="mr-2" />
            Revenue
          </TabsTrigger>
          <TabsTrigger 
            value="performance" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-800/70 data-[state=active]:to-blue-800/70 data-[state=active]:text-white data-[state=active]:shadow-md py-2 px-4"
          >
            <LineChart size={16} className="mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>
        
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <motion.div variants={itemVariants}>
                <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center text-slate-200">
                      <Timer size={18} className="mr-2 text-indigo-400" />
                      Subscription Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">Free Trial</div>
                        <div className={`text-sm font-medium ${
                          mockAnalyticsData.freeTrialStatus === "Active" 
                            ? "text-emerald-400" 
                            : "text-slate-300"
                        }`}>
                          {mockAnalyticsData.freeTrialStatus}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">Current Plan</div>
                        <div className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                          {mockAnalyticsData.plan}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">Monthly Subscription</div>
                        <div className="text-sm font-medium text-white">
                          ₹{mockAnalyticsData.subscriptionMonthly.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">Commission Rate</div>
                        <div className="text-sm font-medium text-white">
                          {mockAnalyticsData.commission}%
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">Months Using ReferRush</div>
                        <div className="text-sm font-medium text-white">
                          {mockAnalyticsData.monthsUsing} months
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="md:col-span-2">
                <RevenueChart data={mockAnalyticsData} />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <motion.div variants={itemVariants}>
                <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center text-slate-200">
                      <DollarSign size={18} className="mr-2 text-emerald-400" />
                      Revenue Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">Total Revenue from Merchant</div>
                        <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                          ₹{mockAnalyticsData.totalRevenue.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">From Subscriptions</div>
                        <div className="text-sm font-medium text-white">
                          ₹{mockAnalyticsData.revenueFromSubscriptions.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">From Commissions</div>
                        <div className="text-sm font-medium text-white">
                          ₹{mockAnalyticsData.revenueFromCommissions.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">Sales Generated</div>
                        <div className="text-sm font-medium text-indigo-300">
                          ₹{mockAnalyticsData.salesGenerated.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">% of Total Sales</div>
                        <div className="text-sm font-medium text-indigo-300">
                          {mockAnalyticsData.percentOfTotalSales}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center text-slate-200">
                      <CreditCard size={18} className="mr-2 text-rose-400" />
                      Cost Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">Total Costs</div>
                        <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-400">
                          ₹{mockAnalyticsData.totalCosts.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">ReferRush Subscription</div>
                        <div className="text-sm font-medium text-white">
                          ₹{mockAnalyticsData.referrushCost.subscription.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">ReferRush Commissions</div>
                        <div className="text-sm font-medium text-white">
                          ₹{mockAnalyticsData.referrushCost.commission.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">WhatsApp Costs</div>
                        <div className="text-sm font-medium text-white">
                          ₹{mockAnalyticsData.whatsappCost.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-slate-400">Payouts</div>
                        <div className="text-sm font-medium text-white">
                          ₹{mockAnalyticsData.payoutsCost.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <ROICard roi={mockAnalyticsData.roi} />
            </motion.div>
          </TabsContent>

          <TabsContent value="revenue">
            <SubscriptionAnalytics data={mockAnalyticsData} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMetrics data={mockAnalyticsData} />
          </TabsContent>
        </motion.div>
      </Tabs>

      {showAnalyticsModal && (
        <AnalyticsModal onClose={() => setShowAnalyticsModal(false)} />
      )}
    </div>
  );
};

export default AnalyticsPage; 