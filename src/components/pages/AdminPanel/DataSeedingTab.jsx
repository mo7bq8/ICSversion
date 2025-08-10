import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, FileJson, FileJson as FileCsv, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { seedData, resetData, getSeedDataAsJson, getSeedDataAsCsv } from '@/services/seedService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { jsonToCsv } from '@/lib/csvUtils';

const SeedingReport = ({ report }) => {
  if (!report) return null;

  return (
    <Card className="mt-6 glass-effect">
      <CardHeader>
        <CardTitle className="text-white">Seeding Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {Object.entries(report.counts).map(([key, value]) => (
            <div key={key}>
              <p className="text-sm text-muted-foreground">{key}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h4 className="font-semibold text-white">Completion</h4>
          <div className="w-full bg-muted rounded-full h-2.5 mt-2">
            <div 
              className="bg-green-500 h-2.5 rounded-full" 
              style={{ width: `${report.completionPercentage}%` }}>
            </div>
          </div>
          <p className="text-right text-sm text-muted-foreground mt-1">{report.completionPercentage}% of fields populated</p>
        </div>
        {report.errors.length > 0 && (
           <div className="mt-4">
            <h4 className="font-semibold text-destructive">Errors</h4>
            <ul className="list-disc list-inside text-destructive text-sm">
                {report.errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
           </div>
        )}
      </CardContent>
    </Card>
  );
};


const DataSeedingTab = ({ onSeedingComplete }) => {
    const { toast } = useToast();
    const dataContext = useData();
    const [seedingReport, setSeedingReport] = React.useState(null);

    const handleSeedData = () => {
      try {
        const report = seedData(dataContext);
        setSeedingReport(report);
        toast({
          title: "Data Seeding Complete",
          description: "The platform has been populated with realistic sample data.",
        });
        if (onSeedingComplete) {
            onSeedingComplete();
        }
      } catch (error) {
        toast({
            title: "Data Seeding Failed",
            description: error.message,
            variant: "destructive"
        });
        console.error(error);
      }
    };
    
    const handleResetData = () => {
        try {
            resetData(dataContext);
            setSeedingReport(null);
            toast({
              title: "Data Reset Successful",
              description: "All module data has been reset to its initial state.",
            });
            if (onSeedingComplete) {
                onSeedingComplete();
            }
        } catch(error) {
             toast({
                title: "Data Reset Failed",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    const handleDownloadJson = () => {
        const jsonData = getSeedDataAsJson();
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'seed_data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "JSON Seed File Downloaded" });
    };

    const handleDownloadCsv = () => {
        const csvData = getSeedDataAsCsv();
        Object.entries(csvData).forEach(([fileName, data]) => {
            jsonToCsv(data, `${fileName}.csv`);
        });
        toast({ title: "CSV Seed Files Downloaded" });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Data Seeding</h2>
            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle className="text-white">Seed & Reset</CardTitle>
                    <CardDescription>Populate the entire platform with a realistic dataset or reset it to default.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={handleSeedData}>
                        <Database className="h-4 w-4 mr-2" />
                        Seed Realistic Data
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Reset All Data
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete all current data and reset the platform to its initial state.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleResetData}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>

             <Card className="glass-effect">
                <CardHeader>
                    <CardTitle className="text-white">Download Seed Files</CardTitle>
                    <CardDescription>Download the generated seed data for offline use or analysis.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" onClick={handleDownloadJson}>
                        <FileJson className="h-4 w-4 mr-2" />
                        Download as JSON
                    </Button>
                    <Button variant="outline" onClick={handleDownloadCsv}>
                        <FileCsv className="h-4 w-4 mr-2" />
                        Download as CSVs
                    </Button>
                </CardContent>
            </Card>

            <SeedingReport report={seedingReport} />
        </div>
    );
};

export default DataSeedingTab;