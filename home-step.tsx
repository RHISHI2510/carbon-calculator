import { useFormContext } from "react-hook-form";
import type { CalculatorFormType } from "@shared/schema";
import { HOME_TYPES, RENEWABLE_SOURCES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Info, ChevronRight, ChevronLeft, Lightbulb, Flame } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HomeStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export function HomeStep({ onNext, onPrevious }: HomeStepProps) {
  const form = useFormContext<CalculatorFormType>();
  
  return (
    <div className="form-step bg-neutral-900 p-6 rounded-lg shadow-lg" data-step="2">
      <h2 className="text-2xl font-heading font-bold text-white mb-6">Home Energy</h2>
      <p className="text-gray-400 mb-6">Let's look at your home energy consumption to estimate that part of your footprint.</p>
      
      <FormField
        control={form.control}
        name="homeType"
        render={({ field }) => (
          <FormItem className="mb-8">
            <FormLabel className="block text-white font-medium mb-2">
              Home Type <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                {HOME_TYPES.map((type) => (
                  <div 
                    key={type.id}
                    className={`cursor-pointer block border-2 ${
                      field.value === type.id
                        ? "border-red-500 bg-red-900 text-white"
                        : "border-neutral-700 hover:border-red-400 bg-neutral-800 text-gray-300"
                    } rounded-lg p-4 flex flex-col items-center transition`}
                    onClick={() => field.onChange(type.id)}
                  >
                    <div className={`text-2xl mb-2 ${field.value === type.id ? "text-red-500" : "text-gray-400"}`}>
                      {type.icon === "building-4-line" && <i className="ri-building-4-line"></i>}
                      {type.icon === "home-4-line" && <i className="ri-home-4-line"></i>}
                      {type.icon === "building-2-line" && <i className="ri-building-2-line"></i>}
                    </div>
                    <span className="font-medium">{type.label}</span>
                    {/* Hidden radio input for form state, but not for UI */}
                    <input 
                      type="radio" 
                      value={type.id} 
                      checked={field.value === type.id}
                      onChange={() => {}}
                      className="sr-only"
                    />
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="mb-6">
        <FormField
          control={form.control}
          name="homeSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-white font-medium mb-2">
                Home Size (sq ft/m²) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter size in square feet or meters"
                  className="w-full p-3 bg-neutral-800 border border-neutral-600 text-white placeholder:text-gray-400"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex space-x-4 mt-2">
          <Label className="flex items-center">
            <input
              type="radio"
              name="sizeUnit"
              value="sqft"
              className="mr-2 accent-red-500"
              checked={form.watch("homeUnit") === "sqft"}
              onChange={() => form.setValue("homeUnit", "sqft")}
            />
            <span className="text-sm text-white">sq ft</span>
          </Label>
          <Label className="flex items-center">
            <input
              type="radio"
              name="sizeUnit"
              value="sqm"
              className="mr-2 accent-red-500"
              checked={form.watch("homeUnit") === "sqm"}
              onChange={() => form.setValue("homeUnit", "sqm")}
            />
            <span className="text-sm text-white">m²</span>
          </Label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField
          control={form.control}
          name="electricityUsage"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center mb-2">
                <FormLabel className="text-white font-medium">
                  Monthly Electricity Usage
                </FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center text-sm text-red-500 cursor-pointer">
                        <Info className="mr-1 h-4 w-4" />
                        Help
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Average electricity consumption ranges from 400-900 kWh per month for a typical household.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormControl>
                <div className="relative">
                  <Lightbulb className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                  <Input
                    type="number"
                    placeholder="kWh per month"
                    className="w-full p-3 pl-12 bg-neutral-800 border border-neutral-600 text-white placeholder:text-gray-400"
                    style={{ color: 'white', backgroundColor: '#262626' }}
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </div>
              </FormControl>
              <p className="text-xs text-gray-400 mt-1">Find this on your electricity bill</p>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="gasUsage"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center mb-2">
                <FormLabel className="text-white font-medium">
                  Monthly Natural Gas Usage
                </FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center text-sm text-red-500 cursor-pointer">
                        <Info className="mr-1 h-4 w-4" />
                        Help
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Average natural gas consumption ranges from 50-150 therms per month for a typical household.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormControl>
                <div className="relative">
                  <Flame className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                  <Input
                    type="number"
                    placeholder="Therms per month"
                    className="w-full p-3 pl-12 bg-neutral-800 border border-neutral-600 text-white placeholder:text-gray-400"
                    style={{ color: 'white', backgroundColor: '#262626' }}
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </div>
              </FormControl>
              <p className="text-xs text-gray-400 mt-1">Find this on your gas bill</p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="renewableSources"
        render={() => (
          <FormItem className="mb-6">
            <FormLabel className="block text-white font-medium mb-2">
              Renewable Energy Sources
            </FormLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {RENEWABLE_SOURCES.map((item) => (
                <FormField
                  key={item.value}
                  control={form.control}
                  name="renewableSources"
                  render={({ field }) => {
                    return (
                      <FormItem 
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                          field.value?.includes(item.value) 
                            ? 'border-red-500 bg-red-900/30' 
                            : 'border-neutral-700 bg-neutral-800 hover:bg-neutral-700'
                        }`}
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.value)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              return checked
                                ? field.onChange([...current, item.value])
                                : field.onChange(current.filter((val) => val !== item.value));
                            }}
                            className="border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white"
                          />
                        </FormControl>
                        <FormLabel className="ml-3 cursor-pointer text-white font-medium">{item.label}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex justify-between mt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          className="px-5 py-3 h-auto font-medium border-neutral-700 text-white hover:bg-neutral-800 hover:text-white"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
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
