import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaf, Twitter, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 mt-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="text-primary-400 h-6 w-6" />
              <h3 className="font-heading font-bold text-white">Carbon Footprint Calculator</h3>
            </div>
            <p className="text-sm mb-4">
              An AI-powered tool to estimate and reduce your carbon emissions. Make informed decisions for a sustainable future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="hover:text-primary-300 transition" href="/about">About Us</Link>
              </li>
              <li>
                <Link className="hover:text-primary-300 transition" href="/how-it-works">How It Works</Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary-300 transition">Methodology</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-300 transition">Carbon Offsetting</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-300 transition">FAQ</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-4">Newsletter</h4>
            <p className="text-sm mb-3">Stay updated with the latest sustainability tips and features.</p>
            <form className="flex">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-neutral-900 border-2 border-neutral-700 text-white rounded-r-none focus:ring-1 focus:ring-red-500"
                style={{ color: 'rgb(255, 255, 255)' }}
              />
              <Button className="rounded-l-none">
                Subscribe
              </Button>
            </form>
            <p className="text-xs mt-2 text-neutral-400">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-6 text-sm text-neutral-400 flex flex-col md:flex-row justify-between">
          <p>© {new Date().getFullYear()} Carbon Footprint Calculator. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-neutral-200 transition">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-200 transition">Terms of Service</a>
            <a href="#" className="hover:text-neutral-200 transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
