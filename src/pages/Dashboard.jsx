import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import ApplicationLifecycleDistribution from '@/components/dashboard/ApplicationLifecycleDistribution';
import CapabilitySupportCoverage from '@/components/dashboard/CapabilitySupportCoverage';
import TechnologyObsolescenceTimeline from '@/components/dashboard/TechnologyObsolescenceTimeline';
import CostDistributionByLayer from '@/components/dashboard/CostDistributionByLayer';
import RiskExposureMatrix from '@/components/dashboard/RiskExposureMatrix';
import ArchitectureRedundancy from '@/components/dashboard/ArchitectureRedundancy';
import DataClassificationSummary from '@/components/dashboard/DataClassificationSummary';
import IntegrationComplexityMap from '@/components/dashboard/IntegrationComplexityMap';
import CloudAdoptionTracker from '@/components/dashboard/CloudAdoptionTracker';
import ArchitectureCompletenessIndex from '@/components/dashboard/ArchitectureCompletenessIndex';

const Dashboard = () => {
  const { applications, capabilities, technologies, infrastructure, dataDictionary } = useData();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Enterprise Architecture Dashboard</h1>
        <p className="text-muted-foreground mt-2">Advanced statistical overview of your architectural landscape.</p>
      </div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <ApplicationLifecycleDistribution applications={applications} />
        </motion.div>
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <CapabilitySupportCoverage capabilities={capabilities} />
        </motion.div>
        <motion.div variants={itemVariants} className="xl:col-span-3">
          <TechnologyObsolescenceTimeline technologies={technologies} />
        </motion.div>
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <CostDistributionByLayer 
            applications={applications} 
            infrastructure={infrastructure} 
            technologies={technologies} 
          />
        </motion.div>
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <RiskExposureMatrix 
            applications={applications} 
            infrastructure={infrastructure} 
            technologies={technologies} 
          />
        </motion.div>
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <ArchitectureRedundancy capabilities={capabilities} />
        </motion.div>
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <DataClassificationSummary dataDictionary={dataDictionary} />
        </motion.div>
        <motion.div variants={itemVariants} className="xl:col-span-3">
          <IntegrationComplexityMap applications={applications} />
        </motion.div>
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <CloudAdoptionTracker infrastructure={infrastructure} />
        </motion.div>
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <ArchitectureCompletenessIndex 
            applications={applications}
            capabilities={capabilities}
            technologies={technologies}
            infrastructure={infrastructure}
            dataDictionary={dataDictionary}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;