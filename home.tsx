import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Leaf, User, Building2, BarChart2, Shield, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white">
      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-red-900 p-4 rounded-full">
                <Leaf className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-6">
              Calculate & Reduce Your Carbon Footprint
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Our AI-powered calculator helps you understand your environmental impact
              and provides personalized recommendations to reduce it.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/calculator">
                <Button size="lg" className="px-8 bg-red-600 hover:bg-red-700 text-white">Get Started</Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="px-8 border-red-600 text-white hover:bg-red-900">Learn More</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-neutral-900 rounded-xl shadow-sm border border-neutral-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading text-white mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Our comprehensive calculator provides detailed insights and actionable recommendations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<User className="h-8 w-8 text-red-500" />}
              title="Personal & Business"
              description="Calculate carbon footprint for individuals or businesses with customized inputs."
            />
            <FeatureCard 
              icon={<BarChart2 className="h-8 w-8 text-red-500" />}
              title="Interactive Visualizations"
              description="See your impact with dynamic charts and visual breakdowns of your emissions."
            />
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-red-500" />}
              title="AI-Powered Analysis"
              description="Get intelligent insights and recommendations based on your unique situation."
            />
            <FeatureCard 
              icon={<Building2 className="h-8 w-8 text-red-500" />}
              title="Home Energy Insights"
              description="Understand how your home energy usage impacts your carbon footprint."
            />
            <FeatureCard 
              icon={<RefreshCcw className="h-8 w-8 text-red-500" />}
              title="Track Progress"
              description="Save reports and track your progress over time as you make changes."
            />
            <FeatureCard 
              icon={<Leaf className="h-8 w-8 text-red-500" />}
              title="Actionable Tips"
              description="Get practical recommendations tailored to your lifestyle and situation."
            />
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 my-16 bg-neutral-900 rounded-xl border border-neutral-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold font-heading text-white mb-6">
            Ready to Measure Your Impact?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Take the first step towards a more sustainable lifestyle.
            Calculate your carbon footprint and discover ways to reduce it.
          </p>
          <Link href="/calculator">
            <Button size="lg" className="px-8 bg-red-600 hover:bg-red-700 text-white">Calculate Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div 
      className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-red-600 transition"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold font-heading text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
}
