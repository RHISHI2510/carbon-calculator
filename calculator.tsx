import { CalculatorForm } from "@/components/calculator/calculator-form";

export default function Calculator() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-black text-white">
      <div className="max-w-4xl mx-auto bg-black rounded-xl shadow-md overflow-hidden border border-neutral-800">
        <CalculatorForm />
      </div>
    </div>
  );
}
