import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from "./components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./components/ui/table";
import { 
  Badge
} from "./components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./components/ui/dropdown-menu";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Skeleton } from "./components/ui/skeleton";
import { BarChart, Activity, Users, MessageSquare, MoreVertical, PieChart, Check, X, ChevronUp, ChevronDown } from "lucide-react";
import AnalyticsModal from "./components/AnalyticsModal";
import NudgeLogsModal from "./components/NudgeLogsModal";
import NudgeModal from "./components/NudgeModal";
import AnalyticsPage from "./components/analytics/AnalyticsPage";

// Floating gradient background component
const BackgroundGradient = () => (
  <div className="fixed inset-0 z-[-1]">
    <div className="absolute inset-0 bg-[#030014] opacity-95"></div>
    <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-[100px] animate-pulse"></div>
    <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-[100px] animate-pulse delay-1000"></div>
  </div>
);

interface Customer {
  _id: string;
  name: string;
  offer: {
    discount: string;
    cashback: number;
    allCustomersCanUseCode: boolean;
  };
  touchpoints: {
    referralWelcomePopup: boolean;
    extension: boolean;
    referralForm: boolean;
    whatsapp: {
      whitelabeled: boolean;
      followUps: {
        enabled: boolean;
        followUpDays: number[];
        nudgeCount: number;
        lastNudgeDate: Date;
      };
    };
    email: {
      whitelabeled: boolean;
      followUps: {
        enabled: boolean;
        followUpDays: number[];
        nudgeCount: number;
        lastNudgeDate: Date;
      };
    };
    sms: boolean;
    abandonedCart: {
      email: boolean;
      whatsapp: boolean;
    };
  };
}

const App: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNudgeModal, setShowNudgeModal] = useState<boolean>(false);
  const [showLogsModal, setShowLogsModal] = useState<boolean>(false);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/customers");
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      } else {
        console.error("Error fetching customers:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedCustomer(expandedCustomer === id ? null : id);
  };

  const StatusIndicator = ({ active }: { active: boolean }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center"
    >
      {active ? (
        <div className="w-6 h-6 flex items-center justify-center">
          <Check size={20} className="text-emerald-500" />
        </div>
      ) : (
        <div className="w-6 h-6 flex items-center justify-center">
          <X size={20} className="text-red-500" />
        </div>
      )}
    </motion.div>
  );

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

  const calculateTouchpointPercentage = (customer: Customer): number => {
    // Count total touchpoints
    const touchpoints = [
      customer.touchpoints.referralWelcomePopup,
      customer.touchpoints.extension,
      customer.touchpoints.referralForm,
      customer.touchpoints.whatsapp.whitelabeled,
      customer.touchpoints.whatsapp.followUps.enabled,
      customer.touchpoints.email.whitelabeled,
      customer.touchpoints.email.followUps.enabled,
      customer.touchpoints.sms,
      customer.touchpoints.abandonedCart.email,
      customer.touchpoints.abandonedCart.whatsapp
    ];
    
    // Count enabled touchpoints
    const enabledCount = touchpoints.filter(Boolean).length;
    
    // Calculate percentage
    return Math.round((enabledCount / touchpoints.length) * 100);
  };

  return (
    <div className="min-h-screen bg-black text-slate-200">
      <BackgroundGradient />
      
      <div className="container mx-auto p-4 md:p-6 relative z-10">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-500">
                Customer Success Dashboard
              </span>
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Manage customer touchpoints and engagement</p>
          </div>
          <div className="flex items-center gap-4 self-end md:self-auto">
            <Button 
              variant="outline"
              onClick={() => setShowAnalytics(true)}
              className="gap-2 bg-slate-900/50 border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-all px-5 py-6"
            >
              <PieChart size={18} />
               ReferRush Analytics
            </Button>
            <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-colors px-5 py-6 shadow-lg shadow-indigo-900/30">
              <Users size={18} className="mr-2" />
              Add Customer
            </Button>
          </div>
        </motion.header>

        <Tabs defaultValue="customers" className="w-full mb-8">
          <TabsList className="bg-slate-900/70 border border-slate-700 mb-6 p-1">
            <TabsTrigger value="customers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-800/70 data-[state=active]:to-blue-800/70 data-[state=active]:text-white data-[state=active]:shadow-md py-2 px-4">
              <Users size={18} className="mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-800/70 data-[state=active]:to-blue-800/70 data-[state=active]:text-white data-[state=active]:shadow-md py-2 px-4">
              <BarChart size={18} className="mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <TabsContent value="customers" className="mt-6">
              {loading ? (
                <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-full bg-slate-800" />
                      <Skeleton className="h-64 w-full bg-slate-800" />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl">
                    <CardContent className="p-0 overflow-auto">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-gradient-to-r from-slate-900 to-slate-800 sticky top-0 z-10">
                            <TableRow className="hover:bg-slate-800/80 border-slate-700">
                              <TableHead className="text-slate-200 font-semibold w-[140px] py-4">Merchant Name</TableHead>
                              <TableHead className="text-slate-200 font-semibold w-[120px] text-center py-4">Offer</TableHead>
                              <TableHead className="text-slate-200 font-semibold w-[120px] text-center py-4">Code Type</TableHead>
                              <TableHead className="text-slate-200 font-semibold w-[80px] text-center py-4">Pop-Up</TableHead>
                              <TableHead className="text-slate-200 font-semibold w-[100px] text-center py-4">Extension</TableHead>
                              <TableHead className="text-slate-200 font-semibold w-[80px] text-center py-4">Form</TableHead>
                              <TableHead className="text-slate-200 font-semibold w-[100px] text-center py-4">WhatsApp WL</TableHead>
                              <TableHead className="text-slate-200 font-semibold w-[100px] text-center py-4">WhatsApp FUs</TableHead>
                              <TableHead className="text-slate-200 font-semibold w-[80px] text-center py-4">Email WL</TableHead>
                              <TableHead className="text-slate-200 font-semibold w-[80px] text-center py-4">Email FUs</TableHead>
                              <TableHead className="text-slate-200 font-semibold w-[60px] text-center py-4">SMS</TableHead>
                              <TableHead className="text-slate-200 font-semibold w-[100px] text-center py-4">Analytics</TableHead>
                              <TableHead className="text-slate-200 font-semibold w-[70px] text-center py-4">ROI</TableHead>
                              <TableHead className="text-slate-200 font-semibold w-[100px] text-center py-4">Touchpoints ON %</TableHead>
                              <TableHead className="text-slate-200 font-semibold text-right w-[80px] py-4">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {customers.map((customer) => (
                              <React.Fragment key={customer._id}>
                                <motion.tr
                                  variants={itemVariants}
                                  className={`hover:bg-slate-800/50 hover:shadow-md border-slate-700/50 transition-all ${expandedCustomer === customer._id ? 'bg-slate-800/30' : ''}`}
                                >
                                  <TableCell className="font-medium py-4 my-2">
                                    <div className="text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 font-semibold">{customer.name}</div>
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300 font-semibold">{customer.offer.discount}</div>
                                    {customer.offer.cashback > 0 && (
                                      <div className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-300 text-xs font-semibold mt-1">₹{customer.offer.cashback}</div>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <div className="text-slate-300">
                                      {customer.offer.allCustomersCanUseCode ? 
                                        <Badge className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-200 hover:from-blue-500/30 hover:to-indigo-500/30">All Customers</Badge> : 
                                        <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 hover:from-purple-500/30 hover:to-pink-500/30">New Customers</Badge>}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <StatusIndicator active={customer.touchpoints.referralWelcomePopup} />
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <StatusIndicator active={customer.touchpoints.extension} />
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <StatusIndicator active={customer.touchpoints.referralForm} />
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <StatusIndicator active={customer.touchpoints.whatsapp.whitelabeled} />
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <div className="text-indigo-300 font-medium bg-indigo-900/20 rounded-full px-2 py-1 inline-block">
                                      {customer.touchpoints.whatsapp.followUps.nudgeCount}/5
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <StatusIndicator active={customer.touchpoints.email.whitelabeled} />
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <div className="text-indigo-300 font-medium bg-indigo-900/20 rounded-full px-2 py-1 inline-block">
                                      {customer.touchpoints.email.followUps.nudgeCount}/5
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <StatusIndicator active={customer.touchpoints.sms} />
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <StatusIndicator active={true} />
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <div className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400 font-semibold">4.2x</div>
                                  </TableCell>
                                  <TableCell className="text-center py-4">
                                    <div className="text-white font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full px-3 py-1 text-xs inline-block">
                                      {calculateTouchpointPercentage(customer)}%
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right pr-4 py-4">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-full transition-all duration-200 shadow-inner">
                                          <MoreVertical size={18} />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200 p-2 shadow-xl shadow-indigo-900/20">
                                        <DropdownMenuItem 
                                          className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-800/50 hover:to-blue-800/50 hover:text-white focus:bg-gradient-to-r focus:from-indigo-800/50 focus:to-blue-800/50 focus:text-white p-2 rounded-md flex items-center gap-2 my-1 transition-all duration-200"
                                          onClick={() => {
                                            setSelectedCustomer(customer);
                                            setShowNudgeModal(true);
                                          }}
                                        >
                                          <MessageSquare size={16} />
                                          Send Nudge
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-800/50 hover:to-blue-800/50 hover:text-white focus:bg-gradient-to-r focus:from-indigo-800/50 focus:to-blue-800/50 focus:text-white p-2 rounded-md flex items-center gap-2 my-1 transition-all duration-200"
                                          onClick={() => {
                                            setSelectedCustomer(customer);
                                            setShowLogsModal(true);
                                          }}
                                        >
                                          <Activity size={16} />
                                          View Nudge Logs
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </motion.tr>
                                {/* Add spacing between rows */}
                                <tr className="h-1 bg-transparent border-none">
                                  <td colSpan={15} className="p-0"></td>
                                </tr>
                              </React.Fragment>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>
          </AnimatePresence>
          
          <TabsContent value="analytics">
            <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl">
              <CardContent className="p-6">
                <AnalyticsPage />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* <AnalyticsModal onClose={() => setShowAnalytics(false)} /> */}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showNudgeModal && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <NudgeModal
              customerId={selectedCustomer._id}
              customerName={selectedCustomer.name}
              onClose={() => setShowNudgeModal(false)}
              onSuccess={() => setShowNudgeModal(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showLogsModal && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <NudgeLogsModal
              customerId={selectedCustomer._id}
              customerName={selectedCustomer.name}
              onClose={() => setShowLogsModal(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

