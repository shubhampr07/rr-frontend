import React, { useState, useEffect } from "react";
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
  CardContent,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Input } from "../components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "../components/ui/checkbox";
import { 
  CheckCircle, 
  AlertCircle, 
  Send, 
  MessageSquare, 
  Phone, 
  BellRing, 
  MessageCircle, 
  RefreshCw, 
  MailCheck, 
  Rocket, 
  Mail, 
  Check,
  Edit,
  User,
  Plus,
  Trash2,
  Save,
  X
} from "lucide-react";

interface ContactInfo {
  id: string;
  type: "email" | "phone";
  value: string;
  isChecked: boolean;
  isPrimary: boolean;
  isEditing?: boolean;
}

interface NudgeModalProps {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const NudgeModal: React.FC<NudgeModalProps> = ({
  customerId,
  customerName,
  customerEmail,
  customerPhone,
  onClose,
  onSuccess
}) => {
  const [touchpoint, setTouchpoint] = useState("referralWelcomePopup");
  const [channel, setChannel] = useState("email");
  const [responseMsg, setResponseMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [contactList, setContactList] = useState<ContactInfo[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newContactType, setNewContactType] = useState<"email" | "phone">("email");
  const [newContactValue, setNewContactValue] = useState("");

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

  // Initialize contacts from props
  useEffect(() => {
    const initialContacts: ContactInfo[] = [];
    
    if (customerEmail) {
      initialContacts.push({
        id: "email-1",
        type: "email",
        value: customerEmail,
        isChecked: false,
        isPrimary: true
      });
    }
    
    if (customerPhone) {
      initialContacts.push({
        id: "phone-1",
        type: "phone",
        value: customerPhone,
        isChecked: false,
        isPrimary: true
      });
    }
    
    setContactList(initialContacts);
  }, [customerEmail, customerPhone]);

  // Filter contacts based on selected channel
  const filteredContacts = contactList.filter(contact => 
    (channel === "email" && contact.type === "email") || 
    (channel === "whatsapp" && contact.type === "phone")
  );

  // Check if any contact is selected for the current channel
  const hasSelectedContact = filteredContacts.some(contact => contact.isChecked);

  const handleSendNudge = async () => {
    try {
      setStatus("loading");
      
      // Get all selected contacts for the current channel
      const selectedContacts = filteredContacts
        .filter(contact => contact.isChecked)
        .map(contact => contact.value);
      
      if (selectedContacts.length === 0) {
        setResponseMsg("Please select at least one contact");
        setStatus("error");
        return;
      }
      
      // Send POST with all selected recipients
      const res = await fetch(
        `https://rr-backend-h3f5.onrender.com/api/nudge/${customerId}/${touchpoint}/${channel}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipients: selectedContacts
          })
        }
      );
      
      const data = await res.json();
      
      if (data.success) {
        setResponseMsg(`Nudge sent successfully to ${selectedContacts.length} ${selectedContacts.length > 1 ? "contacts" : "contact"}`);
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

  const handleContactToggle = (id: string) => {
    setContactList(prevList => 
      prevList.map(contact => 
        contact.id === id 
          ? { ...contact, isChecked: !contact.isChecked }
          : contact
      )
    );
  };

  const handleEditContact = (id: string) => {
    setContactList(prevList => 
      prevList.map(contact => 
        contact.id === id 
          ? { ...contact, isEditing: true }
          : contact
      )
    );
  };

  const handleSaveContact = async (id: string, newValue: string) => {
    try {
      // API call to update contact
      const contactToUpdate = contactList.find(c => c.id === id);
      if (!contactToUpdate) return;

      const res = await fetch(
        `https://rr-backend-h3f5.onrender.com/api/customers/${customerId}/contacts/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: contactToUpdate.type,
            value: newValue
          })
        }
      );
      
      const data = await res.json();
      
      if (data.success) {
        // Update local state
        setContactList(prevList => 
          prevList.map(contact => 
            contact.id === id 
              ? { ...contact, value: newValue, isEditing: false }
              : contact
          )
        );
      } else {
        setResponseMsg(data.error || "Error updating contact");
        setStatus("error");
      }
    } catch (error: any) {
      setResponseMsg("Error: " + error.message);
      setStatus("error");
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      // API call to delete contact
      const res = await fetch(
        `https://rr-backend-h3f5.onrender.com/api/customers/${customerId}/contacts/${id}`,
        {
          method: "DELETE"
        }
      );
      
      const data = await res.json();
      
      if (data.success) {
        // Update local state
        setContactList(prevList => prevList.filter(contact => contact.id !== id));
      } else {
        setResponseMsg(data.error || "Error deleting contact");
        setStatus("error");
      }
    } catch (error: any) {
      setResponseMsg("Error: " + error.message);
      setStatus("error");
    }
  };

  const handleAddContact = async () => {
    try {
      if (!newContactValue.trim()) {
        setResponseMsg(`Please enter a valid ${newContactType}`);
        setStatus("error");
        return;
      }

      // API call to add new contact
      const res = await fetch(
        `https://rr-backend-h3f5.onrender.com/api/customers/${customerId}/contacts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: newContactType,
            value: newContactValue
          })
        }
      );
      
      const data = await res.json();
      
      if (data.success) {
        // Add to local state with returned ID
        const newContact: ContactInfo = {
          id: data.contactId || `${newContactType}-${Date.now()}`,
          type: newContactType,
          value: newContactValue,
          isChecked: true,
          isPrimary: contactList.filter(c => c.type === newContactType).length === 0
        };
        
        setContactList(prevList => [...prevList, newContact]);
        setNewContactValue("");
        setIsAddingNew(false);
      } else {
        setResponseMsg(data.error || "Error adding contact");
        setStatus("error");
      }
    } catch (error: any) {
      setResponseMsg("Error: " + error.message);
      setStatus("error");
    }
  };

  const handleMakePrimary = async (id: string) => {
    try {
      const contactToUpdate = contactList.find(c => c.id === id);
      if (!contactToUpdate) return;

      // API call to make contact primary
      const res = await fetch(
        `https://rr-backend-h3f5.onrender.com/api/customers/${customerId}/contacts/${id}/primary`,
        {
          method: "PUT"
        }
      );
      
      const data = await res.json();
      
      if (data.success) {
        // Update local state
        setContactList(prevList => 
          prevList.map(contact => ({
            ...contact,
            isPrimary: contact.id === id && contact.type === contactToUpdate.type
          }))
        );
      } else {
        setResponseMsg(data.error || "Error updating primary contact");
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
              
              {/* Contact Details Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-slate-300 flex items-center gap-2">
                    <User size={14} className="text-violet-400" />
                    Contact Details
                  </Label>
                  
                  {!isAddingNew && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAddingNew(true);
                        setNewContactType(channel === "email" ? "email" : "phone");
                      }}
                      className="h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md flex items-center gap-1"
                    >
                      <Plus size={14} />
                      <span className="text-xs">Add {channel === "email" ? "Email" : "Phone"}</span>
                    </Button>
                  )}
                </div>
                
                <Card className="bg-slate-900 border-slate-700">
                  <CardContent className="p-3 space-y-3">
                    {filteredContacts.length > 0 ? (
                      <>
                        {filteredContacts.map((contact) => (
                          <div key={contact.id} className="rounded-md border border-slate-700 bg-slate-800 p-3">
                            {contact.isEditing ? (
                              <div className="flex gap-2 items-center">
                                <Input 
                                  defaultValue={contact.value}
                                  id={`edit-${contact.id}`}
                                  className="bg-slate-900 border-slate-700 text-slate-300 flex-1"
                                />
                                <Button
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleSaveContact(contact.id, (document.getElementById(`edit-${contact.id}`) as HTMLInputElement)?.value || "")}
                                  className="h-8 w-8 p-0 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300"
                                >
                                  <Save size={14} />
                                </Button>
                                <Button
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setContactList(prevList => prevList.map(c => c.id === contact.id ? {...c, isEditing: false} : c))}
                                  className="h-8 w-8 p-0 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300"
                                >
                                  <X size={14} />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Checkbox 
                                    id={`check-${contact.id}`}
                                    checked={contact.isChecked}
                                    onCheckedChange={() => handleContactToggle(contact.id)}
                                    className="border-slate-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      {contact.type === "email" ? 
                                        <Mail size={14} className="text-amber-400" /> : 
                                        <Phone size={14} className="text-emerald-400" />
                                      }
                                      <span className="text-slate-300">{contact.value}</span>
                                    </div>
                                    {contact.isPrimary && (
                                      <span className="text-xs text-indigo-400 mt-1 block">Primary</span>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  {!contact.isPrimary && (
                                    <Button
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleMakePrimary(contact.id)}
                                      className="h-7 text-xs px-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
                                    >
                                      Set Primary
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditContact(contact.id)}
                                    className="h-7 w-7 p-0 rounded-md text-slate-400 hover:text-white hover:bg-slate-700"
                                  >
                                    <Edit size={14} />
                                  </Button>
                                  {!contact.isPrimary && (
                                    <Button
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteContact(contact.id)}
                                      className="h-7 w-7 p-0 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-700"
                                    >
                                      <Trash2 size={14} />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {filteredContacts.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Select/deselect all contacts
                              const allChecked = filteredContacts.every(c => c.isChecked);
                              setContactList(prevList => 
                                prevList.map(contact => 
                                  filteredContacts.some(c => c.id === contact.id)
                                    ? { ...contact, isChecked: !allChecked }
                                    : contact
                                )
                              );
                            }}
                            className="w-full h-8 mt-2 bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-300 text-xs"
                          >
                            {filteredContacts.every(c => c.isChecked) ? "Deselect All" : "Select All"} 
                            {channel === "email" ? " Emails" : " Phone Numbers"}
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center p-4 text-slate-400 text-center">
                        No {channel === "email" ? "email addresses" : "phone numbers"} available
                      </div>
                    )}
                    
                    {isAddingNew && (
                      <div className="mt-3 p-3 rounded-md border border-indigo-500/30 bg-indigo-500/10">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            {channel === "email" ? 
                              <Mail size={14} className="text-amber-400" /> : 
                              <Phone size={14} className="text-emerald-400" />
                            }
                            <span className="text-slate-300">Add new {newContactType === "email" ? "email address" : "phone number"}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Input 
                              value={newContactValue}
                              onChange={(e) => setNewContactValue(e.target.value)}
                              placeholder={newContactType === "email" ? "Enter email" : "Enter phone number"}
                              className="bg-slate-800 border-slate-700 text-slate-300 placeholder:text-slate-500"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleAddContact}
                              className="bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/30 text-indigo-300"
                            >
                              Add
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setIsAddingNew(false);
                                setNewContactValue("");
                              }}
                              className="bg-transparent hover:bg-slate-700 border-slate-600 text-slate-300"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
            disabled={status === "loading" || !hasSelectedContact}
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
                Send Nudge{filteredContacts.filter(c => c.isChecked).length > 1 ? " to All" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NudgeModal;