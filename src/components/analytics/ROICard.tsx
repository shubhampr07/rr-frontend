import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ROICardProps {
  roi: number;
}

const ROICard: React.FC<ROICardProps> = ({ roi }) => {
  // Format the ROI for display
  const formattedROI = roi.toFixed(1) + "x";
  
  // Determine color based on ROI value
  const getROIColor = () => {
    if (roi >= 4) return "from-emerald-500 to-green-500";
    if (roi >= 2) return "from-blue-500 to-indigo-500";
    return "from-amber-500 to-orange-500";
  };

  return (
    <Card className="bg-slate-900/60 border-slate-700 overflow-hidden backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center text-slate-200">
          <TrendingUp size={18} className="mr-2 text-emerald-400" />
          Return on Investment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="url(#roiGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: "377 377", strokeDashoffset: 377 }}
                animate={{ 
                  strokeDashoffset: 377 - (377 * Math.min(roi / 5, 1))
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="roiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className={`stop-color-${getROIColor().split(' ')[0].substring(5)}`} />
                  <stop offset="100%" className={`stop-color-${getROIColor().split(' ')[1].substring(3)}`} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                {formattedROI}
              </span>
              <span className="text-xs text-slate-400">ROI</span>
            </div>
          </div>
          
          <div className="space-y-4 flex-1">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-1">ROI Evaluation</h4>
              <p className="text-sm text-slate-300">
                {roi >= 4 
                  ? "Excellent return on investment. Your campaign is performing exceptionally well."
                  : roi >= 2
                  ? "Good return on investment. Your campaign is generating positive returns."
                  : "Average return on investment. Consider optimizing your campaign for better results."}
              </p>
            </div>
            
            <div className="bg-slate-800/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={16} className="text-emerald-400" />
                <h4 className="text-sm font-medium text-slate-300">ROI Impact</h4>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${getROIColor()}`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(roi / 5 * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="text-xs text-slate-400">{Math.min(Math.round(roi / 5 * 100), 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROICard; 