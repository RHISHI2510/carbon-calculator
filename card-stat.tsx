import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardStatProps {
  title: string;
  value: string | number;
  percentage: number;
  colorClass?: string;
  className?: string;
}

export function CardStat({
  title,
  value,
  percentage,
  colorClass = "bg-primary-400",
  className
}: CardStatProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-white">{title}</span>
        <span className="text-sm font-mono text-white">{value}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2.5">
        <motion.div
          className={cn("h-2.5 rounded-full", colorClass)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs text-gray-400">{percentage}% of your total emissions</span>
    </div>
  );
}
