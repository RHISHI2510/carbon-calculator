import { useFormContext } from "react-hook-form";
import type { CalculatorFormType } from "@shared/schema";
import { TRANSPORT_TYPES, CAR_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ChevronRight, ChevronLeft, Gauge, PlaneLanding, PlaneTakeoff, Bus } from "lucide-react";
import { useState, useEffect } from "react";

interface TransportStepProps {
  onNext: () => void;
  onPrevious: () => void;
  onCalculate: () => void;
}

export function TransportStep({ onNext, onPrevious, onCalculate }: TransportStepProps) {
  const form = useFormContext<CalculatorFormType>();
  const [formattedMileage, setFormattedMileage] = useState("12,000");
  
  useEffect(() => {
    // Format the mileage whenever it changes
    const mileage = form.watch("annualMileage");
    if (mileage) {
      setFormattedMileage(mileage.toLocaleString());
    }
  }, [form.watch("annualMileage")]);
  
  return (
    <div className="form-step bg-black" data-step="3">
      <h2 className="text-2xl font-heading font-bold text-white mb-6">Transportation</h2>
      <p className="text-white mb-6">Tell us about your travel habits to estimate transportation emissions.</p>
      
      <FormField
        control={form.control}
        name="primaryTransport"
        render={({ field }) => (
          <FormItem className="mb-8">
            <FormLabel className="block text-white font-medium mb-3">
              Primary Mode of Transportation <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              >
                {TRANSPORT_TYPES.map((type) => (
                  <div
                    key={type.id}
                    className={`cursor-pointer block border-2 ${
                      field.value === type.id
                        ? "border-red-500 bg-black text-white"
                        : "border-gray-500 hover:border-red-300 bg-black text-white"
                    } rounded-lg p-3 flex flex-col items-center transition`}
                    onClick={() => field.onChange(type.id)}
                  >
                    <div className={`text-2xl mb-2 ${field.value === type.id ? "text-red-500" : "text-white"}`}>
                      {type.icon === "car-line" && <i className="ri-car-line"></i>}
                      {type.icon === "bus-line" && <i className="ri-bus-line"></i>}
                      {type.icon === "bike-line" && <i className="ri-bike-line"></i>}
                      {type.icon === "walk-line" && <i className="ri-walk-line"></i>}
                      {type.icon === "flight-takeoff-line" && <i className="ri-flight-takeoff-line"></i>}
                    </div>
                    <span className="font-medium text-sm">{type.label}</span>
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
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
      
      {/* CAR DETAILS */}
      {form.watch("primaryTransport") === "car" && (
        <div id="carDetails" className="car-specific bg-gray-900 p-4 rounded-lg mb-6 border border-gray-800">
          <h3 className="font-medium text-white mb-4">Car Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="carType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-white text-sm mb-2">
                    Car Type
                  </FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full p-3 bg-gray-900 border border-gray-600 text-white">
                        <SelectValue placeholder="Select car type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 text-white border border-gray-600">
                        {CAR_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-white hover:bg-gray-800">
                            {type.label}
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
              name="fuelEfficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-white text-sm mb-2">
                    Fuel Efficiency
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Gauge className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="MPG or L/100km"
                        className="w-full p-3 pl-10 bg-gray-900 border border-gray-600 text-white"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="annualMileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-white text-sm mb-2">
                  Annual Mileage
                </FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={50000}
                    step={1000}
                    defaultValue={[field.value || 12000]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-full h-2"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-white mt-1">
                  <span>0</span>
                  <span>12,500</span>
                  <span>25,000</span>
                  <span>37,500</span>
                  <span>50,000</span>
                </div>
                <div className="text-center mt-2">
                  <span className="font-mono text-sm text-white">{formattedMileage}</span>
                  <span className="text-sm text-white"> miles per year</span>
                </div>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
      )}
      
      {/* PUBLIC TRANSIT DETAILS */}
      {form.watch("primaryTransport") === "publicTransport" && (
        <div className="public-transit-details bg-gray-900 p-4 rounded-lg mb-6 border border-gray-800">
          <h3 className="font-medium text-white mb-4">Public Transit Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="weeklyBusRides"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-white text-sm mb-2">
                    Weekly Bus/Train Rides
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Bus className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="Number of rides per week"
                        min={0}
                        className="w-full p-3 pl-10 bg-gray-900 border border-gray-600 text-white"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="avgCommuteDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-white text-sm mb-2">
                    Average Commute Distance (miles/km)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Average distance per ride"
                      min={0}
                      className="w-full p-3 bg-gray-900 border border-gray-600 text-white"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
      
      {/* BICYCLE DETAILS - No emissions */}
      {form.watch("primaryTransport") === "bike" && (
        <div className="bike-details bg-gray-900 p-4 rounded-lg mb-6 border border-gray-800">
          <h3 className="font-medium text-white mb-4">Cycling Details</h3>
          <div className="p-4 bg-green-900/30 rounded-lg border border-green-800">
            <div className="flex items-center">
              <i className="ri-bike-line text-green-400 text-3xl mr-3"></i>
              <div>
                <p className="text-white font-medium">Zero Carbon Transportation</p>
                <p className="text-gray-300 text-sm">Cycling generates zero direct carbon emissions. Great choice for the environment!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* WALKING DETAILS - No emissions */}
      {form.watch("primaryTransport") === "walking" && (
        <div className="walking-details bg-gray-900 p-4 rounded-lg mb-6 border border-gray-800">
          <h3 className="font-medium text-white mb-4">Walking Details</h3>
          <div className="p-4 bg-green-900/30 rounded-lg border border-green-800">
            <div className="flex items-center">
              <i className="ri-walk-line text-green-400 text-3xl mr-3"></i>
              <div>
                <p className="text-white font-medium">Zero Carbon Transportation</p>
                <p className="text-gray-300 text-sm">Walking produces zero direct carbon emissions. Great choice for the environment!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* FLIGHT DETAILS */}
      {form.watch("primaryTransport") === "flight" && (
        <div className="flight-details bg-gray-900 p-4 rounded-lg mb-6 border border-gray-800">
          <h3 className="font-medium text-white mb-4">Flight Details</h3>
          <p className="text-gray-300 mb-4 text-sm">Air travel can significantly impact your carbon footprint. Please provide your annual flight information and average distances.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="shortFlights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-white text-sm mb-2">
                    Short Flights ({"<"}4 hours)
                  </FormLabel>
                  <p className="text-gray-400 text-xs mb-2">One-way flights, typically domestic or regional (500 miles avg)</p>
                  <FormControl>
                    <div className="relative">
                      <PlaneTakeoff className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="Number of flights per year"
                        min={0}
                        className="w-full p-3 pl-10 bg-gray-900 border border-gray-600 text-white"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="longFlights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-white text-sm mb-2">
                    Long Flights (4+ hours)
                  </FormLabel>
                  <p className="text-gray-400 text-xs mb-2">One-way flights, typically international (2500+ miles avg)</p>
                  <FormControl>
                    <div className="relative">
                      <PlaneLanding className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="Number of flights per year"
                        min={0}
                        className="w-full p-3 pl-10 bg-gray-900 border border-gray-600 text-white"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="avgFlightDistance"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel className="block text-white text-sm mb-2">
                  Average Flight Distance (miles)
                </FormLabel>
                <p className="text-gray-400 text-xs mb-2">For more accurate calculations, provide an estimated average distance of your trips (1000 miles is the default)</p>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Average distance per flight"
                    min={0}
                    className="w-full p-3 bg-gray-900 border border-gray-600 text-white"
                    value={field.value || 1000}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 1000)}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
      )}
      
      {/* Secondary Flight Information (only shown if primary transport is NOT flight) */}
      {form.watch("primaryTransport") !== "flight" && (
        <div className="mb-6 bg-gray-900 p-4 rounded-lg border border-gray-800">
          <Label className="block text-white font-medium mb-2">
            Secondary Transportation: Flights (Past Year)
          </Label>
          <p className="text-gray-400 mb-4 text-sm">Do you also travel by air? Flight emissions can significantly impact your carbon footprint.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="shortFlights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-white text-sm mb-2">
                    Short Flights ({"<"}4 hours)
                  </FormLabel>
                  <p className="text-gray-400 text-xs mb-2">One-way flights, typically domestic or regional</p>
                  <FormControl>
                    <div className="relative">
                      <PlaneTakeoff className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="Number of flights"
                        min={0}
                        className="w-full p-3 pl-10 bg-gray-900 border border-gray-600 text-white"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="longFlights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-white text-sm mb-2">
                    Long Flights (4+ hours)
                  </FormLabel>
                  <p className="text-gray-400 text-xs mb-2">One-way flights, typically international</p>
                  <FormControl>
                    <div className="relative">
                      <PlaneLanding className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="Number of flights"
                        min={0}
                        className="w-full p-3 pl-10 bg-gray-900 border border-gray-600 text-white"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          
          <p className="text-gray-300 mt-3 text-sm">For secondary travel, we'll use default distance estimates for your flights.</p>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          className="px-5 py-3 h-auto font-medium border-gray-700 text-white hover:bg-gray-800"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          type="button" 
          onClick={() => {
            onCalculate();
            onNext();
          }}
          className="px-6 py-3 h-auto font-medium bg-red-600 hover:bg-red-700 text-white"
        >
          Calculate Footprint
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
