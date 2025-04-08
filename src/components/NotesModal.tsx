
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Save, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";

interface NotesModalProps {
  customerId: string;
  customerName: string;
  initialNote?: string;
  onClose: () => void;
  onSuccess?: (note: string) => void;
}

const NotesModal: React.FC<NotesModalProps> = ({ customerId, customerName, initialNote = "", onClose, onSuccess }) => {
  const [note, setNote] = useState(initialNote);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveNote = async () => {
    try {
      setIsSaving(true);
      
      // Make API call to save the note
      const response = await fetch('https://rr-backend-h3f5.onrender.com/api/customers/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          note
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save note');
      }
      
      // Show success toast
      toast.success(`Note for ${customerName} saved successfully`);
      
      // Only close modal and call onSuccess if API request was successful
      if (onSuccess) onSuccess(note);
      onClose();
      
    } catch (error) {
      console.error("Error saving note:", error);
      
      // Show error toast but don't close the modal
      toast.error("Failed to save note. Please try again.");
      setIsSaving(false);
    }
  };

  // Separate handler for the cancel button
  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-slate-700 text-slate-200 sm:max-w-md shadow-xl shadow-indigo-900/20 p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <DialogHeader className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 border-b border-slate-700">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <FileText size={20} className="text-indigo-400" />
              Notes for {customerName}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Add or edit notes about this merchant. Your changes will be saved when you click Save.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6">
            <div className="mb-4">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes about this merchant here..."
                className="bg-slate-800/60 border-slate-700 text-slate-200 placeholder:text-slate-500 h-40 resize-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveNote}
                disabled={isSaving}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-colors shadow-lg shadow-indigo-900/30"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Note
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default NotesModal;