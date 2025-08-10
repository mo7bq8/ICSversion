import { runIcsAggregation as runAggregation } from '@/services/dataService';

export const aggregateAllModules = (allData, rules, zones) => {
  const {
    applications,
    technologies,
    infrastructure,
    securityControls,
    networkComponents,
    dataDictionary,
  } = allData;

  const normalizedData = {
    applications: applications || [],
    technologies: technologies || [],
    infrastructure: infrastructure || [],
    securityControls: securityControls || [],
    networkComponents: networkComponents || [],
    dataDictionary: dataDictionary || [],
  };
  
  const { components, edges } = runAggregation(normalizedData, rules, zones);
  
  return { aggregatedComponents: components, aggregatedEdges: edges };
};

export const getAggregatorSyncStatus = (components) => {
  if (!components || components.length === 0) {
    return { lastRun: null, processed: 0, unclassified: 0, errors: 0 };
  }
  
  const lastAggregated = components.reduce((latest, current) => {
    const currentDate = new Date(current.last_aggregated_at);
    return currentDate > latest ? currentDate : latest;
  }, new Date(0));

  return {
    lastRun: lastAggregated.toISOString(),
    processed: components.length,
    unclassified: components.filter(c => c.ics_level === null || c.ics_level === undefined).length,
    errors: 0,
  };
};
