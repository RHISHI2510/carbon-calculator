import { Button } from "@/components/ui/button";
import { CardStat } from "@/components/ui/card-stat";
import { ProgressRing } from "@/components/ui/progress-ring";
import { RecommendationCard } from "./recommendation-card";
import { motion } from "framer-motion";
import { ChevronLeft, Share, Save } from "lucide-react";
import { formatCO2, formatNumber, calculatePercentage, getComparisonToAverage, getCarbonBudget } from "@/lib/utils";
import type { FootprintResults } from "@/lib/calculations";
import type { Recommendation } from "@shared/schema";
import type { CalculatorFormType } from "@shared/schema";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { useToast } from "@/hooks/use-toast";

interface ResultsStepProps {
  onPrevious: () => void;
  results: FootprintResults;
  recommendations: Recommendation[];
  formData: CalculatorFormType;
}

export function ResultsStep({ onPrevious, results, recommendations, formData }: ResultsStepProps) {
  const { toast } = useToast();
  const homePercentage = calculatePercentage(results.homeEmissions, results.totalEmissions);
  const transportPercentage = calculatePercentage(results.transportEmissions, results.totalEmissions);
  const foodPercentage = calculatePercentage(results.foodEmissions, results.totalEmissions);
  
  const comparison = getComparisonToAverage(results.totalEmissions, formData.location || 'global');
  const budgetPercentage = getCarbonBudget(results.totalEmissions);
  
  // Function to generate and download PDF report
  const generatePDF = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set document properties
      const date = new Date().toLocaleDateString();
      doc.setProperties({
        title: `Carbon Footprint Report - ${date}`,
        subject: 'Carbon Footprint Analysis',
        creator: 'EcoTracker Carbon Calculator'
      });
      
      // Add content
      doc.setFontSize(24);
      doc.setTextColor(40, 40, 40);
      doc.text('Carbon Footprint Report', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Generated on ${date}`, 105, 30, { align: 'center' });
      
      // Add separator line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, 190, 35);
      
      // Add total emissions
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('Total Carbon Footprint:', 20, 45);
      doc.setFontSize(20);
      doc.setTextColor(239, 68, 68); // Red color
      doc.text(`${formatNumber(results.totalEmissions)} tonnes CO2e per year`, 20, 55);
      
      // Add comparison to average
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text(`This is ${comparison.value}% ${comparison.isBetter ? 'below' : 'above'} average for your location.`, 20, 65);
      doc.text(`You're using ${budgetPercentage}% of your annual carbon budget.`, 20, 75);
      
      // Add user input summary section in a table format
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('Input Summary:', 20, 85);
      
      // Format location name properly
      let locationName = formData.location || 'global';
      try {
        // Try to format the location code to a readable name
        locationName = locationName.toUpperCase();
        if (locationName === 'US') locationName = 'United States';
        if (locationName === 'UK') locationName = 'United Kingdom';
        if (locationName === 'CA') locationName = 'Canada';
        if (locationName === 'AU') locationName = 'Australia';
        if (locationName === 'DE') locationName = 'Germany';
        if (locationName === 'FR') locationName = 'France';
        if (locationName === 'IN') locationName = 'India';
        if (locationName === 'CN') locationName = 'China';
      } catch (e) { /* Ignore errors in formatting */ }
      
      // Create table data for user input summary with explicit type checking
      const summaryTableData: string[][] = [];
      
      // Add all entries with null checks
      summaryTableData.push(['Location', locationName]);
      
      if (formData.homeType) summaryTableData.push(['Home Type', formData.homeType]);
      if (formData.homeSize) summaryTableData.push(['Home Size', `${formData.homeSize} ${formData.homeUnit || 'sqft'}`]);
      if (formData.electricityUsage) summaryTableData.push(['Electricity Usage', `${formData.electricityUsage} kWh/month`]);
      if (formData.gasUsage) summaryTableData.push(['Gas Usage', `${formData.gasUsage} therms/month`]);
      if (formData.primaryTransport) summaryTableData.push(['Primary Transport', formData.primaryTransport]);
      if (formData.carType) summaryTableData.push(['Car Type', formData.carType]);
      if (formData.annualMileage) summaryTableData.push(['Annual Mileage', `${formData.annualMileage} miles`]);
      if (formData.shortFlights) summaryTableData.push(['Short Flights (yearly)', formData.shortFlights.toString()]);
      if (formData.longFlights) summaryTableData.push(['Long Flights (yearly)', formData.longFlights.toString()]);
      
      // Use autoTable for input summary if there's at least some data
      if (summaryTableData.length > 0) {
        autoTable(doc, {
          startY: 90,
          body: summaryTableData,
          theme: 'plain',
          styles: {
            fontSize: 10,
            cellPadding: 2
          },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 60 },
            1: { cellWidth: 100 }
          },
          margin: { left: 20, right: 20 }
        });
      }
      
      // Add emissions breakdown
      const summaryFinalY = (doc as any).lastAutoTable.finalY || 120;
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('Emissions Breakdown:', 20, summaryFinalY + 10);
      
      // Use autotable plugin for emissions breakdown
      autoTable(doc, {
        startY: summaryFinalY + 15,
        head: [['Category', 'Emissions (tonnes CO2e)', 'Percentage']],
        body: [
          ['Home Energy', formatCO2(results.homeEmissions), `${homePercentage}%`],
          ['Transportation', formatCO2(results.transportEmissions), `${transportPercentage}%`],
          ['Food & Consumption', formatCO2(results.foodEmissions), `${foodPercentage}%`],
          ['Total', formatCO2(results.totalEmissions), '100%']
        ],
        headStyles: {
          fillColor: [239, 68, 68],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 60, halign: 'right' },
          2: { cellWidth: 40, halign: 'right' }
        },
        theme: 'grid',
        margin: { left: 20, right: 20 }
      });
      
      // Add recommendations header
      const finalY = (doc as any).lastAutoTable.finalY || 140;
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('Recommendations:', 20, finalY + 15);
      
      if (recommendations.length > 0) {
        // Prepare recommendation data for table
        const recommendationData = recommendations.slice(0, 5).map((recommendation, index) => [
          `${index + 1}. ${recommendation.title}`,
          recommendation.description,
          `${recommendation.potentialReduction} tonnes CO2e`
        ]);
        
        // Use autotable for recommendations
        autoTable(doc, {
          startY: finalY + 20,
          head: [['Recommendation', 'Description', 'Potential Reduction']],
          body: recommendationData,
          headStyles: {
            fillColor: [239, 68, 68],
            textColor: 255,
            fontStyle: 'bold'
          },
          bodyStyles: {
            cellPadding: 4
          },
          columnStyles: {
            0: { cellWidth: 50, fontStyle: 'bold' },
            1: { cellWidth: 100 },
            2: { cellWidth: 30, halign: 'center' }
          },
          theme: 'grid',
          margin: { left: 20, right: 20 },
          didDrawCell: (data) => {
            // Add icon for recommendation category
            if (data.section === 'body' && data.column.index === 0 && data.cell.raw) {
              const index = parseInt(data.cell.raw.toString().split('.')[0]) - 1;
              if (index >= 0 && index < recommendations.length) {
                // We would add an icon here if supported by jsPDF
              }
            }
          }
        });
      } else {
        doc.setFontSize(12);
        doc.setTextColor(80, 80, 80);
        doc.text('No specific recommendations available at this time.', 30, finalY + 25);
      }
      
      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('EcoTracker Carbon Calculator - Take action to reduce your carbon footprint today.', 105, 280, { align: 'center' });
      
      // Download the PDF
      doc.save(`carbon-footprint-report-${date}.pdf`);
      
      // Show success toast
      toast({
        title: "Success",
        description: "Your carbon footprint report has been downloaded.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to generate your report. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="form-step" data-step="4">
      <div className="text-center mb-8">
        <motion.h2 
          className="text-2xl font-heading font-bold text-white mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Carbon Footprint Results
        </motion.h2>
        <motion.p 
          className="text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Based on your inputs, we've calculated your estimated carbon footprint.
        </motion.p>
      </div>
      
      {/* Total Footprint Card */}
      <motion.div 
        className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <div className="text-sm text-gray-400 mb-1">Your Annual Carbon Footprint</div>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-white font-mono">{formatNumber(results.totalEmissions)}</span>
              <span className="text-xl font-medium text-gray-300 ml-1">tonnes CO<sub>2</sub>e</span>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                comparison.isBetter ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
              }`}>
                <i className={`ri-arrow-${comparison.isBetter ? 'down' : 'up'}-line mr-1`}></i>
                {comparison.value}% {comparison.isBetter ? 'below' : 'above'} average for your location
              </span>
            </div>
          </div>
          
          <div className="w-40 h-40 relative">
            <ProgressRing percent={budgetPercentage} size={160} strokeWidth={10} color="rgb(239, 68, 68)" bgColor="rgba(239, 68, 68, 0.2)">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-red-500">{budgetPercentage}%</span>
                <span className="text-xs text-white">of carbon budget</span>
              </div>
            </ProgressRing>
          </div>
        </div>
      </motion.div>
      
      {/* Breakdown */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-lg font-heading font-semibold text-white mb-4">Your Footprint Breakdown</h3>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="px-4 py-5">
            <CardStat
              title="Home Energy"
              value={formatCO2(results.homeEmissions)}
              percentage={homePercentage}
              colorClass="bg-red-600"
            />
            
            <CardStat
              title="Transportation"
              value={formatCO2(results.transportEmissions)}
              percentage={transportPercentage}
              colorClass="bg-red-500"
            />
            
            <CardStat
              title="Food & Consumption"
              value={formatCO2(results.foodEmissions)}
              percentage={foodPercentage}
              colorClass="bg-red-400"
            />
          </div>
        </div>
      </motion.div>
      
      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-heading font-semibold text-white">AI-Powered Recommendations</h3>
          <span className="text-xs text-white bg-red-800 px-2 py-1 rounded">Powered by OpenAI</span>
        </div>
        
        <div className="space-y-4">
          {recommendations.slice(0, 3).map((recommendation, index) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              delay={index * 0.2}
            />
          ))}
        </div>
        
        {recommendations.length > 3 && (
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              className="text-red-500 border-red-700 hover:bg-gray-900"
            >
              View All Recommendations
            </Button>
          </div>
        )}
      </motion.div>
      
      <div className="flex flex-wrap justify-between items-center mt-8 gap-4">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={onPrevious}
            className="px-4 py-2.5 h-auto text-sm text-white border-gray-700 hover:bg-gray-900"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Update Information
          </Button>
          <Button 
            variant="outline"
            onClick={generatePDF}
            className="border-red-700 text-red-500 hover:bg-gray-900 px-4 py-2.5 h-auto text-sm"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Report
          </Button>
        </div>
        <Button className="px-5 py-2.5 h-auto text-sm bg-red-600 hover:bg-red-700 text-white">
          <Share className="mr-2 h-4 w-4" />
          Share Results
        </Button>
      </div>
    </div>
  );
}
