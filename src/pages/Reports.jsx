import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileBarChart, Download, Filter, Calendar, Layers, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { jsonToCsv } from '@/lib/csvUtils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportCard = ({ report, index }) => {
  const { applications, technologies, securityControls } = useData();
  const { toast } = useToast();
  
  const generatePdf = (reportData) => {
    const doc = new jsPDF();
    doc.text(report.title, 20, 10);
    doc.autoTable({
      head: [Object.keys(reportData[0])],
      body: reportData.map(row => Object.values(row)),
    });
    doc.save(`${report.title.replace(/\s/g, '_')}.pdf`);
  };

  const handleDownload = (format) => {
    let data;
    if (report.title.includes("Application")) {
      data = applications;
    } else if (report.title.includes("Technology")) {
      data = technologies;
    } else if (report.title.includes("Compliance")) {
      data = securityControls;
    } else {
      toast({ title: "No data available for this report type", variant: "destructive" });
      return;
    }

    if (format === 'csv') {
      jsonToCsv(data, `${report.title.replace(/\s/g, '_')}.csv`);
    } else {
      generatePdf(data.map(item => ({ ID: item.id, Name: item.name, Status: item.status || item.lifecycle })));
    }
    toast({ title: `Report downloaded as ${format.toUpperCase()}` });
  };

  const getIcon = () => {
    if (report.tags.includes('Applications')) return <Layers className="w-6 h-6 text-blue-400" />;
    if (report.tags.includes('Security')) return <Shield className="w-6 h-6 text-green-400" />;
    return <FileBarChart className="w-6 h-6 text-purple-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="glass-effect h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {getIcon()}
            <span className="text-xl text-white">{report.title}</span>
          </CardTitle>
          <CardDescription>{report.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Last Generated: {report.lastGenerated}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {report.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </CardContent>
        <div className="p-6 pt-0 flex gap-2">
          <Button onClick={() => handleDownload('pdf')} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button onClick={() => handleDownload('csv')} className="w-full bg-gradient-to-r from-green-600 to-teal-600">
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default function Reports() {
  const { reports } = useData();
  const { toast } = useToast();

  const handleGenerateNew = () => {
    toast({
      title: "Generate New Report",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };
  
  const handleFilter = () => {
    toast({
      title: "Filter Reports",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports</h1>
          <p className="text-gray-400 mt-2">Generate and download architecture and compliance reports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleFilter}><Filter className="h-4 w-4 mr-2" />Filter</Button>
          <Button onClick={handleGenerateNew} className="bg-gradient-to-r from-blue-600 to-purple-600">Generate New</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <ReportCard key={report.id} report={report} index={index} />
        ))}
      </div>
    </div>
  );
}