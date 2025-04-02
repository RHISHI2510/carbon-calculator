import { motion } from "framer-motion";
import type { Recommendation } from "@shared/schema";
import { formatNumber } from "@/lib/utils";

interface RecommendationCardProps {
  recommendation: Recommendation;
  delay?: number;
}

export function RecommendationCard({ recommendation, delay = 0 }: RecommendationCardProps) {
  const { category, title, description, iconName, potentialReduction } = recommendation;
  
  const getCategoryColors = (): { bg: string; text: string } => {
    switch (category) {
      case 'home':
        return { bg: 'bg-red-900', text: 'text-red-500' };
      case 'transport':
        return { bg: 'bg-red-950', text: 'text-red-400' };
      case 'food':
        return { bg: 'bg-red-900', text: 'text-red-300' };
      default:
        return { bg: 'bg-gray-800', text: 'text-gray-300' };
    }
  };
  
  const colors = getCategoryColors();
  
  return (
    <motion.div 
      className="bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${colors.bg} p-2 rounded-lg mr-4`}>
          <i className={`ri-${iconName} text-xl ${colors.text}`}></i>
        </div>
        <div>
          <h4 className="font-medium text-white mb-1">{title}</h4>
          <p className="text-sm text-gray-400 mb-2">{description}</p>
          <div className={`flex items-center text-xs ${colors.text}`}>
            <i className="ri-leaf-line mr-1"></i>
            <span>Potential reduction: {formatNumber(potentialReduction)} tonnes CO<sub>2</sub>e</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
