import { cn } from "@/lib/utils";
import { CALCULATOR_STEPS } from "@/lib/constants";

interface ProgressStepperProps {
  currentStep: number;
  onChange?: (step: number) => void;
}

export function ProgressStepper({ currentStep, onChange }: ProgressStepperProps) {
  const handleStepClick = (step: number) => {
    if (step < currentStep && onChange) {
      onChange(step);
    }
  };

  return (
    <div className="stepper mb-8">
      <div className="flex justify-between items-center w-full relative">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-700 -z-10 transform -translate-y-1/2"></div>
        
        {CALCULATOR_STEPS.map((step) => (
          <div 
            key={step.id}
            data-step={step.id}
            className={cn(
              "stepper-step flex flex-col items-center cursor-pointer",
              step.id < currentStep ? "stepper-completed" : "",
              step.id === currentStep ? "active" : ""
            )}
            onClick={() => handleStepClick(step.id)}
          >
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-medium mb-2 transition-colors border-2",
                step.id <= currentStep 
                  ? "bg-black border-red-500 text-white" 
                  : "bg-black border-gray-600 text-white"
              )}
            >
              {step.id}
            </div>
            <span 
              className={cn(
                "text-xs sm:text-sm font-medium transition-colors",
                step.id <= currentStep ? "text-white" : "text-gray-400"
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
