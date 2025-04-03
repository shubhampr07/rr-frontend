import React, { useEffect, useState } from "react";
import { X, ArrowRight, BarChart2, Percent, Users, Check, AlertTriangle, Download, TrendingUp, Activity, BarChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Skeleton } from "../components/ui/skeleton";
import { ScrollArea } from "../components/ui/scroll-area";
import { Badge } from "../components/ui/badge";

interface Metrics {
  totalCustomers: number;
  customerSuccessRate: {
    referralWelcomePopup: number;
    extension: number;
    referralForm: number;
    whatsappWhitelabeled: number;
    whatsappFollowUps: number;
    emailWhitelabeled: number;
    emailFollowUps: number;
    qualityOffer: number;
    allCustomersCanUseCode: number;
    overall: number;
  };
  successBreakdown: Array<{
    customerId: string;
    customerName: string;
    successRate: number;
  }>;
}

interface AnalyticsModalProps {
  onClose: () => void;
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ onClose }) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch("https://rr-backend-h3f5.onrender.com/api/metrics/success");
      const data = await res.json();
      if (data.success) {
        setMetrics(data.data);
      } else {
        console.error("Error fetching metrics:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);
  
  // Get performance status gradient colors based on percentage
  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return "from-emerald-500 to-green-500";
    if (percentage >= 50) return "from-amber-500 to-yellow-500";
    return "from-rose-500 to-red-500";
  };

  const getStatusBadgeClass = (percentage: number) => {
    if (percentage >= 75) return "bg-emerald-500/30 text-emerald-300 border-emerald-500/40";
    if (percentage >= 50) return "bg-amber-500/30 text-amber-300 border-amber-500/40";
    return "bg-rose-500/30 text-rose-300 border-rose-500/40";
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 75) return <Check size={14} className="text-emerald-400" />;
    if (percentage >= 50) return <AlertTriangle size={14} className="text-amber-400" />;
    return <X size={14} className="text-rose-400" />;
  };

  // Sort breakdown by success rate descending
  const sortedBreakdown = metrics?.successBreakdown.sort((a, b) => 
    b.successRate - a.successRate
  ) || [];

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0 overflow-hidden bg-slate-900 border-slate-700 shadow-xl">
        <DialogHeader className="p-6 pb-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/30 to-blue-500/30 rounded-lg flex items-center justify-center">
                <BarChart2 size={20} className="text-indigo-400" />
              </div>
              <div>
                <DialogTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300">
                  Success Metrics Dashboard
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-sm mt-1">
                  Comprehensive overview of customer success rates across all touchpoints
                </DialogDescription>
              </div>
            </div>
            {/* <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-slate-800"
            >
              <X size={16} className="text-slate-400" />
            </Button> */}
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <div className="px-6 pt-4">
            <TabsList className="bg-slate-800 border border-slate-700 p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-700 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:border-0 py-2 px-4"
              >
                <BarChart2 size={16} className="mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="breakdown" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-700 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:border-0 py-2 px-4"
              >
                <Users size={16} className="mr-2" />
                Customer Breakdown
              </TabsTrigger>
            </TabsList>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="show"
              variants={containerVariants}
              exit={{ opacity: 0 }}
            >
              <TabsContent value="overview" className="p-6 pt-4">
                {loading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-20 w-full bg-slate-800" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Skeleton className="h-32 w-full bg-slate-800" />
                      <Skeleton className="h-32 w-full bg-slate-800" />
                      <Skeleton className="h-32 w-full bg-slate-800" />
                    </div>
                    <Skeleton className="h-48 w-full bg-slate-800" />
                  </div>
                ) : metrics ? (
                  <>
                    <motion.div variants={containerVariants} className="space-y-6">
                      <motion.div variants={itemVariants}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500/30 to-blue-500/30 border border-indigo-500/30">
                                <Users size={20} className="text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">Total Customers</p>
                                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300">
                                  {metrics.totalCustomers}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="p-3 rounded-full bg-gradient-to-br from-emerald-500/30 to-green-500/30 border border-emerald-500/30">
                                <Percent size={20} className="text-emerald-400" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">Overall Success</p>
                                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                                  {metrics.customerSuccessRate.overall}%
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="p-3 rounded-full bg-gradient-to-br from-violet-500/30 to-purple-500/30 border border-violet-500/30">
                                <TrendingUp size={20} className="text-violet-400" />
                              </div>
                              <div>
                                <p className="text-sm text-slate-400">Top Performing</p>
                                <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
                                  Quality Offer
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <h3 className="text-lg font-medium mb-4 text-slate-200">Touchpoint Performance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-sm font-medium text-slate-200">Referral Popup</div>
                              <Badge className={`${getStatusBadgeClass(metrics.customerSuccessRate.referralWelcomePopup)}`}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(metrics.customerSuccessRate.referralWelcomePopup)}
                                  <span>{metrics.customerSuccessRate.referralWelcomePopup}%</span>
                                </div>
                              </Badge>
                            </div>
                            <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${getStatusColor(metrics.customerSuccessRate.referralWelcomePopup)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metrics.customerSuccessRate.referralWelcomePopup}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-sm font-medium text-slate-200">Extension</div>
                              <Badge className={`${getStatusBadgeClass(metrics.customerSuccessRate.extension)}`}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(metrics.customerSuccessRate.extension)}
                                  <span>{metrics.customerSuccessRate.extension}%</span>
                                </div>
                              </Badge>
                            </div>
                            <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${getStatusColor(metrics.customerSuccessRate.extension)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metrics.customerSuccessRate.extension}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-sm font-medium text-slate-200">Referral Form</div>
                              <Badge className={`${getStatusBadgeClass(metrics.customerSuccessRate.referralForm)}`}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(metrics.customerSuccessRate.referralForm)}
                                  <span>{metrics.customerSuccessRate.referralForm}%</span>
                                </div>
                              </Badge>
                            </div>
                            <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${getStatusColor(metrics.customerSuccessRate.referralForm)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metrics.customerSuccessRate.referralForm}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-sm font-medium text-slate-200">WhatsApp White Label</div>
                              <Badge className={`${getStatusBadgeClass(metrics.customerSuccessRate.whatsappWhitelabeled)}`}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(metrics.customerSuccessRate.whatsappWhitelabeled)}
                                  <span>{metrics.customerSuccessRate.whatsappWhitelabeled}%</span>
                                </div>
                              </Badge>
                            </div>
                            <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${getStatusColor(metrics.customerSuccessRate.whatsappWhitelabeled)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metrics.customerSuccessRate.whatsappWhitelabeled}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-sm font-medium text-slate-200">WhatsApp Follow-Ups</div>
                              <Badge className={`${getStatusBadgeClass(metrics.customerSuccessRate.whatsappFollowUps)}`}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(metrics.customerSuccessRate.whatsappFollowUps)}
                                  <span>{metrics.customerSuccessRate.whatsappFollowUps}%</span>
                                </div>
                              </Badge>
                            </div>
                            <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${getStatusColor(metrics.customerSuccessRate.whatsappFollowUps)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metrics.customerSuccessRate.whatsappFollowUps}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-sm font-medium text-slate-200">Email White Label</div>
                              <Badge className={`${getStatusBadgeClass(metrics.customerSuccessRate.emailWhitelabeled)}`}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(metrics.customerSuccessRate.emailWhitelabeled)}
                                  <span>{metrics.customerSuccessRate.emailWhitelabeled}%</span>
                                </div>
                              </Badge>
                            </div>
                            <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${getStatusColor(metrics.customerSuccessRate.emailWhitelabeled)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metrics.customerSuccessRate.emailWhitelabeled}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-sm font-medium text-slate-200">Email Follow-Ups</div>
                              <Badge className={`${getStatusBadgeClass(metrics.customerSuccessRate.emailFollowUps)}`}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(metrics.customerSuccessRate.emailFollowUps)}
                                  <span>{metrics.customerSuccessRate.emailFollowUps}%</span>
                                </div>
                              </Badge>
                            </div>
                            <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${getStatusColor(metrics.customerSuccessRate.emailFollowUps)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metrics.customerSuccessRate.emailFollowUps}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-sm font-medium text-slate-200">Quality Offer</div>
                              <Badge className={`${getStatusBadgeClass(metrics.customerSuccessRate.qualityOffer)}`}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(metrics.customerSuccessRate.qualityOffer)}
                                  <span>{metrics.customerSuccessRate.qualityOffer}%</span>
                                </div>
                              </Badge>
                            </div>
                            <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${getStatusColor(metrics.customerSuccessRate.qualityOffer)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metrics.customerSuccessRate.qualityOffer}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <div className="text-sm font-medium text-slate-200">All Customers Can Use Code</div>
                              <Badge className={`${getStatusBadgeClass(metrics.customerSuccessRate.allCustomersCanUseCode)}`}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(metrics.customerSuccessRate.allCustomersCanUseCode)}
                                  <span>{metrics.customerSuccessRate.allCustomersCanUseCode}%</span>
                                </div>
                              </Badge>
                            </div>
                            <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${getStatusColor(metrics.customerSuccessRate.allCustomersCanUseCode)}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${metrics.customerSuccessRate.allCustomersCanUseCode}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                            <div className="flex items-center gap-2 text-sm font-medium text-indigo-300 mb-1">
                              <Activity size={16} />
                              <span>Success Analysis</span>
                            </div>
                            <p className="text-xs text-slate-400">
                              Quality Offer is your top-performing touchpoint. Consider optimizing 
                              Email Follow-Ups which shows the lowest adoption rate.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                        <AlertTriangle className="h-8 w-8 text-rose-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-200">Error Loading Metrics</h3>
                      <p className="text-slate-400 mt-2">Please try again later or contact support.</p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="breakdown" className="p-6 pt-4">
                {loading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-12 w-full bg-slate-800" />
                    <Skeleton className="h-64 w-full bg-slate-800" />
                  </div>
                ) : metrics ? (
                  <motion.div variants={containerVariants} className="space-y-6">
                    <motion.div variants={itemVariants}>
                      <div className="mb-4">
                        <h3 className="text-lg font-medium mb-2 text-slate-200">Customer Success Breakdown</h3>
                        <p className="text-sm text-slate-400">
                          Individual success rates for all {metrics.totalCustomers} customers
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                        <CardHeader className="p-4 border-b border-slate-700/50">
                          <div className="grid grid-cols-12 font-medium text-sm text-slate-300">
                            <div className="col-span-5">Customer</div>
                            <div className="col-span-5">Success Rate</div>
                            <div className="col-span-2">Status</div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <ScrollArea className="h-64 w-full">
                            <div className="divide-y divide-slate-700/30">
                              {sortedBreakdown.map((item, index) => (
                                <motion.div 
                                  key={item.customerId} 
                                  className="grid grid-cols-12 p-4 hover:bg-slate-700/50"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <div className="col-span-5 font-medium text-slate-200">{item.customerName}</div>
                                  <div className="col-span-5">
                                    <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden mb-1">
                                      <motion.div 
                                        className={`h-full bg-gradient-to-r ${getStatusColor(item.successRate)}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.successRate}%` }}
                                        transition={{ duration: 0.5, delay: 0.1 + (index * 0.02) }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-slate-300">{item.successRate}%</span>
                                  </div>
                                  <div className="col-span-2">
                                    <Badge className={`${getStatusBadgeClass(item.successRate)}`}>
                                      {item.successRate >= 75 ? "Great" : item.successRate >= 50 ? "Average" : "Poor"}
                                    </Badge>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                        <AlertTriangle className="h-8 w-8 text-rose-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-200">Error Loading Customer Data</h3>
                      <p className="text-slate-400 mt-2">Please try again later or contact support.</p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
        
        <div className="p-4 border-t border-slate-700/50 flex justify-end gap-2 bg-slate-800">
          <Button 
            variant="outline"
            onClick={onClose}
            className="bg-transparent hover:bg-slate-700 border-slate-600 text-slate-300"
          >
            Close
          </Button>
          <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 gap-2">
            <Download size={16} />
            Download Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsModal;