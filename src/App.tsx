

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  CardContent,
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
import { BarChart, Activity, Users, MessageSquare, MoreVertical, PieChart, ArrowLeft, ChartArea, FileText } from "lucide-react";
import NudgeLogsModal from "./components/NudgeLogsModal";
import NudgeModal from "./components/NudgeModal";
import AnalyticsPage from "./components/analytics/AnalyticsPage";
import TouchpointSwitch from "./components/TouchPointSwitch";
import AnalyticsModal from "./components/AnalyticsModal";
import NotesModal from "./components/NotesModal";
import {getCustomers} from "./api/customerApi"

// Floating gradient background component
// const BackgroundGradient = () => (
//   <div className="fixed inset-0 z-[-1]">
//     {/* <div className="absolute inset-0 bg-[#030014] opacity-95"></div> */}
//     <div className="absolute inset-0 opacity-95" style={{ backgroundColor: "rgb(0 0 0 / var(--tw-bg-opacity, 1))"}}></div>
//     <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-[100px] animate-pulse"></div>
//     <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-[100px] animate-pulse delay-1000"></div>
//   </div>
// );

interface Customer {
  _id: string;
  name: string;
  note: string;
  pointOfContact: {
    name: string;
    email: string[];
    phone: string[];
  }
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
  const [activeSection, setActiveSection] = useState<string>('customers');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [_showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNudgeModal, setShowNudgeModal] = useState<boolean>(false);
  const [showLogsModal, setShowLogsModal] = useState<boolean>(false);
  const [expandedCustomer, _setExpandedCustomer] = useState<string | null>(null);
  const [showCustomerAnalytics, setShowCustomerAnalytics] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>("customers");
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const [_error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);


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

  // Handle view customer analytics
  const handleViewCustomerAnalytics = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerAnalytics(true);
  };

  // Handle back from customer analytics
  const handleBackFromCustomerAnalytics = () => {
    setShowCustomerAnalytics(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="min-h-screen bg-black text-slate-200">
      {/* <BackgroundGradient /> */}
      
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
                {showCustomerAnalytics && selectedCustomer
                  ? `${selectedCustomer.name} Analytics`
                  : "Customer Success Dashboard"}
              </span>
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              {showCustomerAnalytics
                ? `Performance metrics and insights for ${selectedCustomer?.name}`
                : "Manage customer touchpoints and engagement"}
            </p>
          </div>
          <div className="flex items-center gap-4 self-end md:self-auto">
            {showCustomerAnalytics ? (
              <Button 
                variant="outline"
                onClick={handleBackFromCustomerAnalytics}
                className="gap-2 bg-slate-900/50 border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition-all px-5 py-6"
              >
                <ArrowLeft size={18} />
                Back to Customers
              </Button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </motion.header>

        {!showCustomerAnalytics ? (
          <Tabs defaultValue="customers" className="w-full" value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="bg-slate-900/70 border border-slate-700 mb-6 p-1">
              <TabsTrigger value="customers" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-800/70 data-[state=active]:to-blue-800/70 data-[state=active]:text-white data-[state=active]:shadow-md py-2 px-4" onClick={() => setActiveSection('customers')}>
                <Users size={18} className="mr-2" />
                Customers
              </TabsTrigger>
              <TabsTrigger value="customersuccessoverall" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-800/70 data-[state=active]:to-blue-800/70 data-[state=active]:text-white data-[state=active]:shadow-md py-2 px-4" onClick={() => setActiveSection('customersuccessoverall')}>
                <ChartArea size={18} className="mr-2" />
                Success Metrics 
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
                        <div className="overflow-x-auto scrollbar-hide">
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
                                <TableHead className="text-slate-200 font-semibold w-[80px] text-center py-4">Notes</TableHead>
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
                                      {/* <StatusIndicator active={customer.touchpoints.referralWelcomePopup} /> */}
                                      <TouchpointSwitch
                                        isEnabled={customer.touchpoints.referralWelcomePopup}
                                        customerId={customer._id}
                                        touchpointKey="referralWelcomePopup"
                                        onToggleSuccess={(newValue) => {
                                          // Optionally update local state or show a notification here
                                          console.log("Referral Welcome Popup updated to:", newValue);
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                      {/* <StatusIndicator active={customer.touchpoints.extension} /> */}
                                      <TouchpointSwitch
                                        isEnabled={customer.touchpoints.extension}
                                        customerId={customer._id}
                                        touchpointKey="extension"
                                        onToggleSuccess={(newValue) => {
                                          // Optionally update local state or show a notification here
                                          console.log("Extension updated to:", newValue);
                                        }}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                      {/* <StatusIndicator active={customer.touchpoints.referralForm} /> */}
                                      <TouchpointSwitch
                                        isEnabled={customer.touchpoints.referralForm}
                                        customerId={customer._id}
                                        touchpointKey="referralForm"
                                        onToggleSuccess={(newValue) => {
                                          // Optionally update local state or show a notification here
                                          console.log("Referral Form updated to:", newValue);
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                      {/* <StatusIndicator active={customer.touchpoints.whatsapp.whitelabeled} /> */}
                                      <TouchpointSwitch
                                        isEnabled={customer.touchpoints.whatsapp.whitelabeled}
                                        customerId={customer._id}
                                        touchpointKey="whatsapp.whitelabeled"
                                        onToggleSuccess={(newValue) => {
                                          // Optionally update local state or show a notification here
                                          console.log("WhatsApp WL updated to:", newValue);
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                      <div className="text-indigo-300 font-medium bg-indigo-900/20 rounded-full px-2 py-1 inline-block">
                                        {customer.touchpoints.whatsapp.followUps.nudgeCount}/5
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                      {/* <StatusIndicator active={customer.touchpoints.email.whitelabeled} /> */}
                                      <TouchpointSwitch
                                        isEnabled={customer.touchpoints.email.whitelabeled}
                                        customerId={customer._id}
                                        touchpointKey="email.whitelabeled"
                                        onToggleSuccess={(newValue) => {
                                          // Optionally update local state or show a notification here
                                          console.log("Email WL updated to:", newValue);
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                      <div className="text-indigo-300 font-medium bg-indigo-900/20 rounded-full px-2 py-1 inline-block">
                                        {customer.touchpoints.email.followUps.nudgeCount}/5
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                      {/* <StatusIndicator active={customer.touchpoints.sms} /> */}
                                      <TouchpointSwitch
                                        isEnabled={customer.touchpoints.sms}
                                        customerId={customer._id}
                                        touchpointKey="sms"
                                        onToggleSuccess={(newValue) => {
                                          // Optionally update local state or show a notification here
                                          console.log("SMS updated to:", newValue);
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-full transition-all duration-200 shadow-inner"
                                        onClick={() => {
                                          setSelectedCustomer(customer);
                                          setShowNotesModal(true);
                                        }}
                                      >
                                        <FileText size={18} />
                                      </Button>
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
                                          <DropdownMenuItem 
                                            className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-800/50 hover:to-blue-800/50 hover:text-white focus:bg-gradient-to-r focus:from-indigo-800/50 focus:to-blue-800/50 focus:text-white p-2 rounded-md flex items-center gap-2 my-1 transition-all duration-200"
                                            onClick={() => handleViewCustomerAnalytics(customer)}
                                          >
                                            <BarChart size={16} />
                                            View Analytics
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
            {activeSection === 'customersuccessoverall' && 
            <TabsContent value="customersuccessoverall" className="mt-6">
              <AnalyticsModal />
              </TabsContent>
            }
              </Tabs>
              
            ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl mb-6">
                <CardContent className="p-6">
                  {selectedCustomer && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-6">
                        <Badge className="bg-gradient-to-r from-violet-600/30 to-indigo-600/30 text-violet-100 py-1 px-3">
                          {selectedCustomer.offer.allCustomersCanUseCode ? 'All Customers' : 'New Customers'} • {selectedCustomer.offer.discount} Discount
                        </Badge>
                        <div className="text-emerald-400 font-medium flex items-center">
                          <PieChart size={16} className="mr-2" />
                          ROI: 4.2x
                        </div>
                      </div>
                      <AnalyticsPage/>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      
      <AnimatePresence>
        {showNotesModal && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <NotesModal
              customerId={selectedCustomer._id}
              customerName={selectedCustomer.name}
              initialNote={selectedCustomer.note || ""}
              onClose={() => setShowNotesModal(false)}
              onSuccess={(updatedNote:any) => {
                setCustomers(prev => prev.map(c => 
                  c._id === selectedCustomer._id 
                    ? {...c, note: updatedNote} 
                    : c
                ));
                setShowNotesModal(false);
              }}
            />
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
              customerEmail={selectedCustomer.pointOfContact?.email}
              customerPhone={selectedCustomer.pointOfContact?.phone}
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