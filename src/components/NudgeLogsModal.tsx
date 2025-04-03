import React, { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Inbox, 
  ClipboardList, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Calendar,
  Download,
  ArrowDown,
  RotateCcw,
  Bell,
  Filter,
  MailQuestion,
  Search
} from "lucide-react";

interface NudgeLog {
  _id: string;
  touchpoint: string;
  channel: string;
  sentAt: string;
  success: boolean;
  errorMessage?: string;
}

interface NudgeLogsModalProps {
  customerId: string;
  customerName: string;
  onClose: () => void;
}

const NudgeLogsModal: React.FC<NudgeLogsModalProps> = ({ 
  customerId, 
  customerName, 
  onClose 
}) => {
  const [logs, setLogs] = useState<NudgeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "success" | "failed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://rr-backend-h3f5.onrender.com/api/nudge/logs/${customerId}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      } else {
        console.error("Error fetching logs:", data.error);
      }
    } catch (error: any) {
      console.error("Fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [customerId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get the appropriate channel icon
  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'email':
        return <Mail size={14} className="text-amber-400 mr-1.5" />;
      case 'whatsapp':
        return <Phone size={14} className="text-emerald-400 mr-1.5" />;
      default:
        return <MessageSquare size={14} className="text-blue-400 mr-1.5" />;
    }
  };

  // Function to get touchpoint display name
  const getTouchpointName = (touchpoint: string) => {
    const touchpointMap: Record<string, string> = {
      "referralWelcomePopup": "Referral Welcome Popup",
      "extension": "Extension",
      "referralForm": "Referral Form",
      "whatsappWhitelabeling": "WhatsApp White Labeling",
      "whatsappFollowUps": "WhatsApp Follow-Ups",
      "emailWhitelabeling": "Email White Labeling",
      "emailFollowUps": "Email Follow-Ups",
      "abandonedCart": "Abandoned Cart"
    };
    
    return touchpointMap[touchpoint] || touchpoint;
  };

  // Function to get touchpoint icon based on type
  const getTouchpointIcon = (touchpoint: string) => {
    if (touchpoint.includes("email")) {
      return <Mail size={14} className="text-amber-400 mr-1.5" />;
    } else if (touchpoint.includes("whatsapp")) {
      return <Phone size={14} className="text-emerald-400 mr-1.5" />;
    } else if (touchpoint.includes("referral")) {
      return <MessageSquare size={14} className="text-indigo-400 mr-1.5" />;
    } else if (touchpoint.includes("abandoned")) {
      return <RotateCcw size={14} className="text-rose-400 mr-1.5" />;
    } else if (touchpoint.includes("extension")) {
      return <Bell size={14} className="text-blue-400 mr-1.5" />;
    } else {
      return <MailQuestion size={14} className="text-slate-400 mr-1.5" />;
    }
  };

  // Function to get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }
  };

  // Filter logs based on filter and search query
  const filteredLogs = logs.filter(log => {
    // Apply status filter
    if (filter === "success" && !log.success) return false;
    if (filter === "failed" && log.success) return false;
    
    // Apply search filter (if provided)
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        getTouchpointName(log.touchpoint).toLowerCase().includes(searchLower) ||
        log.channel.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Calculate stats
  const successCount = logs.filter(log => log.success).length;
  const failedCount = logs.filter(log => !log.success).length;
  const successRate = logs.length > 0 ? Math.round((successCount / logs.length) * 100) : 0;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden bg-slate-900 border-slate-700 shadow-xl">
        <DialogHeader className="p-6 pb-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/30 to-blue-500/30 rounded-lg flex items-center justify-center">
              <ClipboardList size={20} className="text-indigo-400" />
            </div>
            <div>
              <DialogTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300">
                Nudge Activity Logs
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-sm mt-1">
                Communication history for <span className="text-slate-300 font-medium">{customerName}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!loading && logs.length > 0 && (
          <div className="px-6 pt-4 pb-2 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div className="flex gap-3">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setFilter("all")}
                className={`bg-transparent border-slate-700 px-3 ${filter === "all" ? "text-indigo-300 border-indigo-500/30 bg-indigo-500/10" : "text-slate-400 hover:text-slate-300"}`}
              >
                All ({logs.length})
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setFilter("success")}
                className={`bg-transparent border-slate-700 px-3 ${filter === "success" ? "text-emerald-300 border-emerald-500/30 bg-emerald-500/10" : "text-slate-400 hover:text-slate-300"}`}
              >
                <CheckCircle size={14} className="mr-1.5 text-emerald-400" />
                Successful ({successCount})
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setFilter("failed")}
                className={`bg-transparent border-slate-700 px-3 ${filter === "failed" ? "text-rose-300 border-rose-500/30 bg-rose-500/10" : "text-slate-400 hover:text-slate-300"}`}
              >
                <XCircle size={14} className="mr-1.5 text-rose-400" />
                Failed ({failedCount})
              </Button>
            </div>
            
            <div className="relative w-full md:w-auto">
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
              <input 
                type="text"
                placeholder="Search nudges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-md w-full md:w-[200px] text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        <div className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-indigo-500 animate-spin mb-4"></div>
              <p className="text-slate-400">Loading communication logs...</p>
            </div>
          ) : logs.length > 0 ? (
            <>
              {filteredLogs.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="h-[360px]"
                >
                  <ScrollArea className="h-full">
                    <Table>
                      <TableHeader className="bg-slate-800/90 sticky top-0 z-10">
                        <TableRow className="border-slate-700 ">
                          <TableHead className="text-slate-300 w-44">
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-slate-400" />
                              <span>Timestamp</span>
                              <ArrowDown size={12} className="text-slate-500" />
                            </div>
                          </TableHead>
                          <TableHead className="text-slate-300">
                            <div className="flex items-center gap-2">
                              <Inbox size={14} className="text-slate-400" />
                              <span>Touchpoint</span>
                            </div>
                          </TableHead>
                          <TableHead className="text-slate-300">
                            <div className="flex items-center gap-2">
                              <MessageSquare size={14} className="text-slate-400" />
                              <span>Channel</span>
                            </div>
                          </TableHead>
                          <TableHead className="text-slate-300 text-center w-28">
                            <div className="flex items-center justify-center gap-2">
                              <Clock size={14} className="text-slate-400" />
                              <span>Status</span>
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {filteredLogs.map((log, index) => (
                            <motion.tr
                              key={log._id}
                              variants={itemVariants}
                              initial="hidden"
                              animate="show"
                              exit={{ opacity: 0, y: -10 }}
                              custom={index}
                              className="border-slate-800 hover:bg-slate-800/50 transition-colors group"
                            >
                              <TableCell className="py-3">
                                <div className="flex flex-col">
                                  <span className="text-xs text-slate-300 font-medium font-mono">
                                    {formatDate(log.sentAt)}
                                  </span>
                                  <span className="text-xs text-slate-500 mt-0.5">
                                    {getRelativeTime(log.sentAt)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-3">
                                <div className="flex items-center">
                                  <div className="p-1.5 rounded-md bg-slate-800 border border-slate-700 mr-2 group-hover:bg-slate-700 transition-colors">
                                    {getTouchpointIcon(log.touchpoint)}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-slate-200">
                                      {getTouchpointName(log.touchpoint)}
                                    </span>
                                    <span className="text-xs text-slate-500 mt-0.5">
                                      {log.success ? "Delivered successfully" : "Delivery failed"}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-3">
                                <Badge 
                                  variant="outline" 
                                  className={`capitalize ${log.channel === 'email' ? 'border-amber-500/30 bg-amber-500/10' : 'border-emerald-500/30 bg-emerald-500/10'} flex items-center px-2.5 py-1`}
                                >
                                  {getChannelIcon(log.channel)}
                                  <span className={log.channel === 'email' ? 'text-amber-300' : 'text-emerald-300'}>
                                    {log.channel}
                                  </span>
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center py-3">
                                {log.success ? (
                                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center mx-auto px-2.5 py-1">
                                    <CheckCircle size={12} className="mr-1.5" />
                                    Delivered
                                  </Badge>
                                ) : (
                                  <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center mx-auto px-2.5 py-1">
                                    <XCircle size={12} className="mr-1.5" />
                                    Failed
                                  </Badge>
                                )}
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <div className="w-16 h-16 bg-slate-800/60 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                    <Filter size={24} className="text-slate-500" />
                  </div>
                  <p className="text-slate-300 font-medium">No matching nudges found</p>
                  <p className="text-slate-500 text-sm mt-1">Try adjusting your search filters</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setFilter("all");
                      setSearchQuery("");
                    }}
                    className="mt-4 bg-transparent hover:bg-slate-800 border-slate-700 text-slate-300"
                  >
                    <RotateCcw size={14} className="mr-2" />
                    Reset Filters
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="w-16 h-16 bg-slate-800/60 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                <Inbox size={24} className="text-slate-500" />
              </div>
              <p className="text-slate-300 font-medium">No nudge logs available</p>
              <p className="text-slate-500 text-sm mt-1">No communication history found for this customer</p>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t border-slate-700/50 flex justify-between gap-2 bg-gradient-to-r from-slate-800 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 flex items-center">
              <Clock size={14} className="mr-1.5" /> 
              {filteredLogs.length} of {logs.length} {logs.length === 1 ? 'log entry' : 'log entries'}
            </div>
            {logs.length > 0 && (
              <div className="text-xs hidden sm:flex items-center text-slate-400">
                <CheckCircle size={14} className="text-emerald-400 mr-1.5" />
                <span>{successRate}% success rate</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {logs.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-transparent hover:bg-slate-700 border-slate-600 text-slate-300 flex gap-2"
              >
                <Download size={14} />
                Export CSV
              </Button>
            )}
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NudgeLogsModal;