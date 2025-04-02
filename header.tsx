import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Leaf } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path: string) => location === path;
  
  const navItems = [
    { name: "How It Works", path: "/how-it-works" },
    { name: "About Us", path: "/about" },
    { name: "Resources", path: "/" }
  ];
  
  return (
    <header className="bg-black shadow-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="text-primary-500 h-6 w-6" />
          <h1 className="font-heading font-bold text-lg sm:text-xl text-white">
            Carbon Footprint Calculator
          </h1>
        </Link>
        
        <div className="hidden sm:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`text-sm font-medium ${isActive(item.path) ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
            >
              {item.name}
            </Link>
          ))}
          
          <Link href="/calculator">
            <Button>Get Started</Button>
          </Link>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="sm:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`text-base font-medium ${isActive(item.path) ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <Link href="/calculator" onClick={() => setIsOpen(false)}>
                <Button className="mt-4">
                  Get Started
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
