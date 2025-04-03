import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import { 
  Card,
  CardContent 
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  AlertCircle, 
  Send, 
  MessageSquare, 
  Phone, 
  BellRing, 
  MessageCircle, 
  ChevronDown, 
  RefreshCw, 
  MailCheck, 
  Rocket, 
  Mail, 
  Check
} from "lucide-react";

interface NudgeModalProps {
  customerId: string;
  customerName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const NudgeModal: React.FC<NudgeModalProps> = ({
  customerId,
  customerName,
  onClose,
  onSuccess
}) => {
  const [touchpoint, setTouchpoint] = useState("referralWelcomePopup");
  const [channel, setChannel] = useState("email");
  const [responseMsg, setResponseMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500
      }
    }
  };

  const handleSendNudge = async () => {
    try {
      setStatus("loading");
      
      // Send POST without additional message/subject payload, so backend defaults apply
      const res = await fetch(
        `http://localhost:5000/api/nudge/${customerId}/${touchpoint}/${channel}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}) // no custom message/subject sent
        }
      );
      
      const data = await res.json();
      
      if (data.success) {
        setResponseMsg("Nudge sent successfully");
        setStatus("success");
        onSuccess && onSuccess();
      } else {
        setResponseMsg(data.error || "Error sending nudge");
        setStatus("error");
      }
    } catch (error: any) {
      setResponseMsg("Error: " + error.message);
      setStatus("error");
    }
  };

  // Map of touchpoint IDs to display names and icons
  const touchpointOptions = [
    { id: "referralWelcomePopup", label: "Referral Welcome Popup", icon: <Rocket size={16} className="text-indigo-400" /> },
    { id: "extension", label: "Extension", icon: <Rocket size={16} className="text-blue-400" /> },
    { id: "referralForm", label: "Referral Form", icon: <MessageSquare size={16} className="text-violet-400" /> },
    { id: "whatsappWhitelabeling", label: "WhatsApp White Labeling", icon: <Phone size={16} className="text-emerald-400" /> },
    { id: "whatsappFollowUps", label: "WhatsApp Follow-Ups", icon: <BellRing size={16} className="text-emerald-400" /> },
    { id: "emailWhitelabeling", label: "Email White Labeling", icon: <Mail size={16} className="text-amber-400" /> },
    { id: "emailFollowUps", label: "Email Follow-Ups", icon: <MailCheck size={16} className="text-amber-400" /> },
    { id: "abandonedCart", label: "Abandoned Cart", icon: <RefreshCw size={16} className="text-rose-400" /> }
  ];

  // Map of channel options with icons
  const channelOptions = [
    { id: "email", label: "Email", icon: <Mail size={16} className="text-amber-400" /> },
    { id: "whatsapp", label: "WhatsApp", icon: <Phone size={16} className="text-emerald-400" /> }
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden bg-slate-900 border-slate-700 shadow-xl">
        <DialogHeader className="p-6 pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/30 to-blue-500/30 rounded-lg flex items-center justify-center">
              <BellRing size={20} className="text-indigo-400" />
            </div>
            <div>
              <DialogTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-300">
                Send Nudge
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-sm mt-1">
                Remind {customerName} about their next steps
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="p-6 space-y-6"
        >
          <Card className="bg-slate-800 border-slate-700 overflow-hidden">
            <CardContent className="p-4 space-y-5">
              <div className="space-y-3">
                <Label htmlFor="touchpoint" className="text-sm text-slate-300 flex items-center gap-2">
                  <MessageCircle size={14} className="text-indigo-400" />
                  Touchpoint
                </Label>
                <Select 
                  value={touchpoint} 
                  onValueChange={setTouchpoint}
                >
                  <SelectTrigger 
                    id="touchpoint" 
                    className="w-full bg-slate-900 border-slate-700 text-slate-300 focus:ring-indigo-500"
                  >
                    <SelectValue placeholder="Select a touchpoint" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
                    {touchpointOptions.map((option) => (
                      <SelectItem 
                        key={option.id} 
                        value={option.id}
                        className="focus:bg-slate-700 focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="channel" className="text-sm text-slate-300 flex items-center gap-2">
                  <MessageSquare size={14} className="text-blue-400" />
                  Channel
                </Label>
                <Select 
                  value={channel} 
                  onValueChange={setChannel}
                >
                  <SelectTrigger 
                    id="channel" 
                    className="w-full bg-slate-900 border-slate-700 text-slate-300 focus:ring-indigo-500"
                  >
                    <SelectValue placeholder="Select a channel" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-300">
                    {channelOptions.map((option) => (
                      <SelectItem 
                        key={option.id} 
                        value={option.id}
                        className="focus:bg-slate-700 focus:text-white"
                      >
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <AnimatePresence>
            {responseMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Alert 
                  variant={status === "success" ? "default" : "destructive"}
                  className={status === "success" 
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"}
                >
                  <div className="flex items-center gap-2">
                    {status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-rose-400" />
                    )}
                    <AlertDescription className="font-medium">{responseMsg}</AlertDescription>
                  </div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <DialogFooter className="p-4 border-t border-slate-700/50 flex justify-end gap-2 bg-slate-800">
          <Button 
            variant="outline"
            onClick={onClose}
            className="bg-transparent hover:bg-slate-700 border-slate-600 text-slate-300"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendNudge}
            disabled={status === "loading"}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 gap-2"
          >
            {status === "loading" ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent"></div>
                Sending...
              </>
            ) : status === "success" ? (
              <>
                <Check className="h-4 w-4" />
                Sent
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Nudge
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NudgeModal;