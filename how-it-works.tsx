import { Leaf, Calculator, BarChart2, Lightbulb, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">How It Works</h1>
              <p className="text-lg text-gray-300">
                Learn about our methodology and how we calculate your carbon footprint
              </p>
            </motion.div>
          </div>
          
          <div className="mb-16">
            <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800">
              <h2 className="text-2xl font-semibold font-heading text-white mb-6">Our Process</h2>
              
              <div className="space-y-12">
                <ProcessStep 
                  number="1"
                  icon={<Calculator className="h-6 w-6 text-white" />}
                  title="Input Your Data"
                  description="Answer questions about your lifestyle, home energy use, transportation habits, and more. The more details you provide, the more accurate your results will be."
                  delay={0.1}
                />
                
                <ProcessStep 
                  number="2"
                  icon={<BarChart2 className="h-6 w-6 text-white" />}
                  title="Advanced Calculations"
                  description="Our algorithm processes your inputs using scientifically validated emission factors and calculation methodologies to estimate your carbon footprint."
                  delay={0.3}
                />
                
                <ProcessStep 
                  number="3"
                  icon={<Lightbulb className="h-6 w-6 text-white" />}
                  title="AI-Powered Recommendations"
                  description="Based on your results, our AI generates personalized recommendations to help you reduce your carbon footprint in ways that fit your lifestyle and have the biggest impact."
                  delay={0.5}
                />
                
                <ProcessStep 
                  number="4"
                  icon={<Leaf className="h-6 w-6 text-white" />}
                  title="Track Your Progress"
                  description="Save your results, implement changes, and recalculate periodically to track your progress and see the impact of your efforts over time."
                  delay={0.7}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold font-heading text-white mb-6">Our Methodology</h2>
            
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-red-600 transition mb-8">
              <h3 className="text-xl font-medium text-white mb-4">Emission Factors</h3>
              <p className="text-gray-300 mb-4">
                We use emission factors from reputable sources including:
              </p>
              <ul className="list-disc pl-8 space-y-2 text-gray-300">
                <li>EPA's Emissions & Generation Resource Integrated Database (eGRID)</li>
                <li>International Energy Agency (IEA) data</li>
                <li>Greenhouse Gas Protocol standards</li>
                <li>Department of Energy and Climate Change (DECC) conversion factors</li>
              </ul>
            </div>
            
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-red-600 transition mb-8">
              <h3 className="text-xl font-medium text-white mb-4">Calculation Approach</h3>
              <p className="text-gray-300 mb-4">
                Our calculator follows these principles:
              </p>
              <ul className="list-disc pl-8 space-y-2 text-gray-300">
                <li>Comprehensive scope covering direct and indirect emissions</li>
                <li>Location-specific factors to account for regional differences</li>
                <li>Regular updates to reflect the latest emission factors and research</li>
                <li>Transparent methodology that clearly shows how calculations are performed</li>
              </ul>
            </div>
            
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-red-600 transition">
              <h3 className="text-xl font-medium text-white mb-4">AI Recommendation Engine</h3>
              <p className="text-gray-300 mb-4">
                Our AI recommendation system:
              </p>
              <ul className="list-disc pl-8 space-y-2 text-gray-300">
                <li>Analyzes your specific carbon footprint profile</li>
                <li>Identifies the highest impact areas where changes could make the biggest difference</li>
                <li>Considers local availability of green alternatives based on your location</li>
                <li>Tailors suggestions to your lifestyle and preferences</li>
                <li>Estimates potential CO₂ savings for each recommendation</li>
              </ul>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold font-heading text-white mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <FaqItem 
                question="How accurate is the carbon footprint calculator?"
                answer="Our calculator provides an estimate based on the information you provide. The more detailed your inputs, the more accurate the result. While no calculator can provide perfect precision, we aim for accuracy within 10-15% of your actual footprint."
              />
              
              <FaqItem 
                question="What emissions are included in the calculation?"
                answer="We include direct emissions from transportation and home energy use, as well as indirect emissions from food consumption, goods purchased, and services used. We follow the GHG Protocol's scope definitions where possible."
              />
              
              <FaqItem 
                question="How often should I recalculate my footprint?"
                answer="We recommend recalculating every 6-12 months, or whenever you make significant lifestyle changes like moving, changing vehicles, or implementing major energy efficiency improvements."
              />
              
              <FaqItem 
                question="Is my data private and secure?"
                answer="Yes, we take data privacy seriously. Your personal information is never sold or shared with third parties. All data is stored securely and used only to calculate your carbon footprint and provide recommendations."
              />
            </div>
          </div>
          
          <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 text-center">
            <h2 className="text-2xl font-semibold font-heading text-white mb-4">Ready to Calculate Your Footprint?</h2>
            <p className="text-gray-300 mb-6">
              Get started now to discover your carbon footprint and receive personalized recommendations.
            </p>
            <Link href="/calculator">
              <Button className="px-8 py-6 h-auto bg-red-600 hover:bg-red-700 text-white">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessStep({ 
  number, 
  icon, 
  title, 
  description, 
  delay = 0 
}: { 
  number: string; 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay?: number;
}) {
  return (
    <motion.div 
      className="flex items-start"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="mr-6 relative">
        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div className="absolute top-0 -right-1 -translate-y-1/3 w-6 h-6 bg-neutral-800 rounded-full border-2 border-red-600 flex items-center justify-center text-xs font-bold text-white">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-red-600 transition">
      <h3 className="text-lg font-medium text-white mb-2">{question}</h3>
      <p className="text-gray-300">{answer}</p>
    </div>
  );
}
