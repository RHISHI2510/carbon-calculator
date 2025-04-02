import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgressStepper } from "./progress-stepper";
import { ProfileStep } from "./profile-step";
import { HomeStep } from "./home-step";
import { TransportStep } from "./transport-step";
import { ResultsStep } from "./results-step";
import { DEFAULT_FORM_VALUES } from "@/lib/constants";
import { calculatorFormSchema, type CalculatorFormType } from "@shared/schema";
import { calculateFootprint, DEFAULT_RESULTS, type FootprintResults } from "@/lib/calculations";
import { getRecommendations } from "@/lib/openai";
import type { Recommendation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function CalculatorForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [results, setResults] = useState<FootprintResults>(DEFAULT_RESULTS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<CalculatorFormType>({
    resolver: zodResolver(calculatorFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });
  
  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleCalculate = async () => {
    try {
      setIsCalculating(true);
      
      // Validate the form data
      const formData = form.getValues();
      console.log("Form data being sent:", formData);
      form.trigger();
      
      if (!formData.location) {
        toast({
          title: "Location is required",
          description: "Please go back and select your location",
          variant: "destructive",
        });
        return;
      }
      
      // Calculate the footprint
      const calculationResults = await calculateFootprint(formData);
      console.log("Calculation results received:", calculationResults);
      setResults(calculationResults);
      
      // Get recommendations
      const recommendationData = {
        footprintData: formData,
        ...calculationResults
      };
      
      console.log("Recommendation data:", recommendationData);
      const recs = await getRecommendations(recommendationData);
      console.log("Recommendations received:", recs);
      setRecommendations(recs);
      
    } catch (error) {
      console.error("Error calculating footprint:", error);
      toast({
        title: "Calculation Error",
        description: "There was an error calculating your carbon footprint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };
  
  return (
    <div className="calculator-container p-6 bg-black text-white">
      <ProgressStepper 
        currentStep={currentStep} 
        onChange={(step) => setCurrentStep(step)} 
      />
      
      <FormProvider {...form}>
        <form id="carbonCalculator" onSubmit={(e) => e.preventDefault()}>
          {currentStep === 1 && (
            <ProfileStep onNext={goToNextStep} />
          )}
          
          {currentStep === 2 && (
            <HomeStep 
              onNext={goToNextStep} 
              onPrevious={goToPreviousStep} 
            />
          )}
          
          {currentStep === 3 && (
            <TransportStep 
              onNext={goToNextStep} 
              onPrevious={goToPreviousStep} 
              onCalculate={handleCalculate}
            />
          )}
          
          {currentStep === 4 && (
            <ResultsStep 
              onPrevious={goToPreviousStep} 
              results={results}
              recommendations={recommendations}
              formData={form.getValues()}
            />
          )}
        </form>
      </FormProvider>
    </div>
  );
}
