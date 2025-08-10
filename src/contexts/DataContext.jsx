import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getCapabilities,
  getApplications,
  getTechnologies,
  getSecurityControls,
  getRelations,
  getRelationNodes,
  getUsers,
  getRoles,
  getAlerts,
  getReports,
  getNetworkInterfaces,
  getDataFlows,
  getNetworkComponents,
  getNetworkDependencies,
  getNetworkSecurity,
  getInfrastructure,
  getGeneratedInsights,
  getScenarios,
  getDecisions,
  getDataDictionary,
  getEntityRelationships,
  getDataEntities,
  saveData,
  getIcsLevelRules,
  getIcsZones,
  getAggregatedIcsComponents,
  getAggregatedIcsEdges,
  getIcsNotes,
  runIcsAggregation
} from '@/services/dataService';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export const DataProvider = ({ children }) => {
  const { user, isAuthenticated, logAction, updateUserInContext } = useAuth();
  const { toast } = useToast();
  
  const [capabilities, setCapabilities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [securityControls, setSecurityControls] = useState([]);
  const [relations, setRelations] = useState([]);
  const [relationNodes, setRelationNodes] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);
  const [networkInterfaces, setNetworkInterfaces] = useState([]);
  const [dataFlows, setDataFlows] = useState([]);
  const [networkComponents, setNetworkComponents] = useState([]);
  const [networkDependencies, setNetworkDependencies] = useState([]);
  const [networkSecurity, setNetworkSecurity] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);
  const [generatedInsights, setGeneratedInsights] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [dataDictionary, setDataDictionary] = useState([]);
  const [entityRelationships, setEntityRelationships] = useState([]);
  const [dataEntities, setDataEntities] = useState([]);
  
  const [icsLevelRules, setIcsLevelRules] = useState([]);
  const [icsZones, setIcsZones] = useState([]);
  const [icsNotes, setIcsNotes] = useState([]);
  const [aggregatedIcsComponents, setAggregatedIcsComponents] = useState([]);
  const [aggregatedIcsEdges, setAggregatedIcsEdges] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const refreshAggregatedIcsData = useCallback(() => {
  try {
    const allData = {
      applications: getApplications(),
      technologies: getTechnologies(),
      infrastructure: getInfrastructure(),
      securityControls: getSecurityControls(),
      networkComponents: getNetworkComponents(),
      dataDictionary: getDataDictionary(),
      relations: getRelations(),
      networkDependencies: getNetworkDependencies(),
      dataFlows: getDataFlows(),
    };
    const rules = getIcsLevelRules();
    const zones = getIcsZones();

    const { components, edges, status } = runIcsAggregation(allData, rules, zones);

    setAggregatedIcsComponents(components);
    setAggregatedIcsEdges(edges);
    saveData('aggregatedIcsComponents', components);
    saveData('aggregatedIcsEdges', edges);
    saveData('aggregatorStatus', status);

    toast({ title: 'ICS Aggregation Complete', description: `${status.processed} processed, ${status.unclassified} unclassified.` });
  } catch (e) {
    console.error('ICS Aggregation Failed:', e);
    toast({ title: 'ICS Aggregation Failed', description: e.message || 'Unexpected error', variant: 'destructive' });
  }
}, [toast]);, [toast]);

  useEffect(() => {
    const loadData = () => {
      if (isAuthenticated) {
        setCapabilities(getCapabilities());
        setApplications(getApplications());
        setTechnologies(getTechnologies());
        setSecurityControls(getSecurityControls());
        setRelations(getRelations());
        setRelationNodes(getRelationNodes());
        setUsers(getUsers());
        setRoles(getRoles());
        setAlerts(getAlerts());
        setReports(getReports());
        setNetworkInterfaces(getNetworkInterfaces());
        setDataFlows(getDataFlows());
        setNetworkComponents(getNetworkComponents());
        setNetworkDependencies(getNetworkDependencies());
        setNetworkSecurity(getNetworkSecurity());
        setInfrastructure(getInfrastructure());
        setGeneratedInsights(getGeneratedInsights());
        setScenarios(getScenarios());
        setDecisions(getDecisions());
        setDataDictionary(getDataDictionary());
        setEntityRelationships(getEntityRelationships());
        setDataEntities(getDataEntities());
        
        setIcsLevelRules(getIcsLevelRules());
        setIcsZones(getIcsZones());
        setIcsNotes(getIcsNotes());
        setAggregatedIcsComponents(getAggregatedIcsComponents());
        setAggregatedIcsEdges(getAggregatedIcsEdges());
        
        if (getAggregatedIcsComponents().length === 0) {
          refreshAggregatedIcsData();
        }
      }
      setLoading(false);
    };

    loadData();
  }, [isAuthenticated, refreshAggregatedIcsData]);

  const createCrudOperations = useCallback((key, state, setState, options = {}) => {
    const { shouldAggregate = true } = options;
    const entityNamePlural = key.charAt(0).toUpperCase() + key.slice(1);
    const entityName = entityNamePlural.endsWith('ies') ? entityNamePlural.slice(0, -3) + 'y' : (entityNamePlural.endsWith('s') ? entityNamePlural.slice(0, -1) : entityNamePlural);

    const addFn = (item) => {
      const newItem = { ...item, id: Date.now() + Math.random().toString(36).substr(2, 9) };
      const updated = [...state, newItem];
      setState(updated);
      saveData(key, updated);
      if(logAction) logAction(`Create ${entityName}`, `Name: ${item.name || item.title || item.id}`);
      if (shouldAggregate) refreshAggregatedIcsData();
    };

    const updateFn = (item) => {
      const updated = state.map(i => i.id === item.id ? item : i);
      setState(updated);
      saveData(key, updated);
      if(logAction) logAction(`Update ${entityName}`, `Name: ${item.name || item.title || item.id}`);
      if (shouldAggregate) refreshAggregatedIcsData();
    };

    const deleteFn = (id) => {
      const itemToDelete = state.find(i => i.id === id);
      const updated = state.filter(i => i.id !== id);
      setState(updated);
      saveData(key, updated);
      if(itemToDelete && logAction) logAction(`Delete ${entityName}`, `ID: ${id}, Name: ${itemToDelete.name || itemToDelete.title || id}`);
      if (shouldAggregate) refreshAggregatedIcsData();
    };

    const bulkAddFn = (data) => {
      const newItems = data.map(item => ({ ...item, id: Date.now() + Math.random().toString(36).substr(2, 9), lastUpdated: new Date().toISOString().split('T')[0] }));
      const updated = [...state, ...newItems];
      setState(updated);
      saveData(key, updated);
      if(logAction) logAction(`Bulk Add ${entityNamePlural}`, `${newItems.length} items added.`);
      if (shouldAggregate) refreshAggregatedIcsData();
    };
    
    return {
      [`add${entityNamePlural}`]: addFn,
      [`update${entityNamePlural}`]: updateFn,
      [`delete${entityNamePlural}`]: deleteFn,
      [`bulkAdd${entityNamePlural}`]: bulkAddFn,
    };
  }, [logAction, refreshAggregatedIcsData]);
  
  const updateUser = useCallback((updatedUserData) => {
      const updatedUsers = users.map(u => u.id === updatedUserData.id ? updatedUserData : u);
      setUsers(updatedUsers);
      saveData('users', updatedUsers);
      
      if (user && user.id === updatedUserData.id) {
        updateUserInContext(updatedUserData);
      }
      logAction('Update User', `Name: ${updatedUserData.name}`);
  }, [users, user, updateUserInContext, logAction]);


  const addUser = useCallback((newUserData) => {
    const newUser = { ...newUserData, id: Date.now() };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveData('users', updatedUsers);
    logAction('Create User', `Name: ${newUser.name}`);
  }, [users, logAction]);

  const value = {
    loading,
    capabilities, ...createCrudOperations('capabilities', capabilities, setCapabilities, { shouldAggregate: false }),
    applications, ...createCrudOperations('applications', applications, setApplications),
    technologies, ...createCrudOperations('technologies', technologies, setTechnologies),
    securityControls, ...createCrudOperations('securityControls', securityControls, setSecurityControls),
    dataDictionary, ...createCrudOperations('dataDictionary', dataDictionary, setDataDictionary),
    infrastructure, ...createCrudOperations('infrastructure', infrastructure, setInfrastructure),
    networkInterfaces, ...createCrudOperations('networkInterfaces', networkInterfaces, setNetworkInterfaces),
    dataFlows, ...createCrudOperations('dataFlows', dataFlows, setDataFlows, { shouldAggregate: false }),
    networkComponents, ...createCrudOperations('networkComponents', networkComponents, setNetworkComponents),
    scenarios, ...createCrudOperations('scenarios', scenarios, setScenarios, { shouldAggregate: false }),
    decisions, ...createCrudOperations('decisions', decisions, setDecisions, { shouldAggregate: false }),
    users, addUser, updateUser,
    roles, ...createCrudOperations('roles', roles, setRoles, { shouldAggregate: false }),
    relations, setRelations,
    relationNodes, setRelationNodes,
    alerts, setAlerts,
    reports, setReports,
    networkDependencies, setNetworkDependencies,
    networkSecurity, setNetworkSecurity,
    generatedInsights, setGeneratedInsights,
    entityRelationships, setEntityRelationships,
    dataEntities, setDataEntities,
    
    icsLevelRules, ...createCrudOperations('icsLevelRules', icsLevelRules, setIcsLevelRules),
    icsZones, ...createCrudOperations('icsZones', icsZones, setIcsZones),
    icsNotes, ...createCrudOperations('icsNotes', icsNotes, setIcsNotes, { shouldAggregate: false }),
    aggregatedIcsComponents,
    aggregatedIcsEdges,
    refreshAggregatedIcsData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};