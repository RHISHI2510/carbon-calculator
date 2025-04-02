import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { CalculatorFormType } from "@shared/schema";
import { COUNTRIES, HOUSEHOLD_SIZES } from "@/lib/constants";
import { getLocationBasedIncomeRanges } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Building, User, ChevronRight } from "lucide-react";

interface ProfileStepProps {
  onNext: () => void;
}

export function ProfileStep({ onNext }: ProfileStepProps) {
  const form = useFormContext<CalculatorFormType>();
  const [incomeRanges, setIncomeRanges] = useState(getLocationBasedIncomeRanges());
  
  // Watch for location changes
  const location = useWatch({
    control: form.control,
    name: "location"
  });
  
  // Update income ranges when location changes
  useEffect(() => {
    if (location) {
      setIncomeRanges(getLocationBasedIncomeRanges(location));
    }
  }, [location]);
  
  return (
    <div className="form-step" data-step="1">
      <h2 className="text-2xl font-heading font-bold text-white mb-6">Personal Details</h2>
      <p className="text-white mb-6">Help us understand your situation to provide more accurate estimations.</p>
      
      <div className="mb-6">
        <Label className="block mb-3">
          <span className="text-white font-medium">I am calculating for:</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`border-2 rounded-md p-6 flex justify-center items-center cursor-pointer ${
              form.watch("calculationType") === "individual" 
                ? "border-red-500 bg-black text-white" 
                : "border-gray-500 hover:border-red-500 text-white"
            }`}
            onClick={() => form.setValue("calculationType", "individual")}
          >
            <User className="mr-2 h-5 w-5" />
            <span className="font-medium">Individual</span>
          </div>
          <div
            className={`border-2 rounded-md p-6 flex justify-center items-center cursor-pointer ${
              form.watch("calculationType") === "business" 
                ? "border-red-500 bg-black text-white" 
                : "border-gray-500 hover:border-red-500 text-white"
            }`}
            onClick={() => form.setValue("calculationType", "business")}
          >
            <Building className="mr-2 h-5 w-5" />
            <span className="font-medium">Business</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-medium">
                Location <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full p-3 bg-gray-900 border border-gray-600 text-white">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white border border-gray-600">
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.value} value={country.value} className="text-white hover:bg-gray-800">
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="householdSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-medium">
                Household Size <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Select 
                  onValueChange={(value) => field.onChange(Number(value))} 
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger className="w-full p-3 bg-gray-900 border border-gray-600 text-white">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 text-white border border-gray-600">
                    {HOUSEHOLD_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value} className="text-white hover:bg-gray-800">
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="incomeRange"
        render={({ field }) => (
          <FormItem className="mb-6">
            <FormLabel className="text-white font-medium">
              Annual Income Range
            </FormLabel>
            <FormControl>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full p-3 bg-gray-900 border border-gray-600 text-white">
                  <SelectValue placeholder="Select income range" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border border-gray-600">
                  {incomeRanges.map((range: { value: string; label: string }) => (
                    <SelectItem key={range.value} value={range.value} className="text-white hover:bg-gray-800">
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <p className="text-xs text-white mt-1">This helps us provide more relevant recommendations.</p>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
      
      <div className="flex justify-end mt-8">
        <Button 
          type="button" 
          onClick={onNext}
          className="px-6 py-3 h-auto font-medium bg-red-600 hover:bg-red-700 text-white"
        >
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
