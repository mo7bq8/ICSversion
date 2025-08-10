const getInitialData = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

export const saveData = (key, data) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to localStorage for key "${key}":`, error);
  }
};

export const initializeDefaultData = () => {
  if (!localStorage.getItem('users')) {
    saveData('users', [
      { id: 1, name: 'Admin User', email: 'admin@kipic.com', password: 'password', role: 'Administrator', lastLogin: '2025-07-30', status: 'Active' },
      { id: 2, name: 'Archie Tek', email: 'architect@kipic.com', password: 'password', role: 'Enterprise Architect', lastLogin: '2025-07-29', status: 'Active' },
      { id: 3, name: 'Guest User', email: 'guest@kipic.com', password: 'password', role: 'Viewer', lastLogin: '2025-07-28', status: 'Inactive' },
      { id: 4, name: 'Talal Askar', email: 'talal.askar@gmail.com', password: 'root', role: 'Master', lastLogin: '2025-07-31', status: 'Active' },
      { id: 5, name: 'New Master User', email: 't@kipic.com', password: 'root', role: 'Master', lastLogin: '2025-07-31', status: 'Active' },
      { id: 6, name: 'Demo Tester', email: 'demo.user@kipic.com', password: 'password', role: 'Enterprise Architect', lastLogin: '2025-07-31', status: 'Active' }
    ]);
  }
  if (!localStorage.getItem('roles')) {
    saveData('roles', [
      { id: 1, name: 'Administrator', description: 'Full access to all modules and settings.' },
      { id: 2, name: 'Enterprise Architect', description: 'Can edit all architecture modules.' },
      { id: 3, name: 'Viewer', description: 'Read-only access to all modules.' },
      { 
        id: 4, 
        name: 'Master', 
        description: 'God mode. Full control over everything.',
        permissions: {
          "Business Capabilities": { "View": true, "Create": true, "Edit": true, "Delete": true },
          "Application Architecture": { "View": true, "Create": true, "Edit": true, "Delete": true },
          "Technology Architecture": { "View": true, "Create": true, "Edit": true, "Delete": true },
          "Infrastructure Architecture": { "View": true, "Create": true, "Edit": true, "Delete": true },
          "Network Architecture": { "View": true, "Create": true, "Edit": true, "Delete": true },
          "Data Architecture": { "View": true, "Create": true, "Edit": true, "Delete": true },
          "Security Architecture": { "View": true, "Create": true, "Edit": true, "Delete": true },
          "Scenario Planning": { "View": true, "Create": true, "Edit": true, "Delete": true },
          "Decision Log": { "View": true, "Create": true, "Edit": true, "Delete": true },
          "ICS Levels": { "View": true, "Create": true, "Edit": true, "Delete": true }
        }
      }
    ]);
  }
  if (!localStorage.getItem('capabilities')) {
    saveData('capabilities', [
      { id: 1, name: 'Customer Relationship Management', owner: 'Sales Team', criticality: 'High', status: 'Active', description: 'Manages all customer interactions and data.', linkedApps: ['Salesforce CRM'], compliance: 'Compliant', lastUpdated: '2025-07-15', strategicGoals: 'Improve Customer Satisfaction', linkedProcesses: 'Order-to-Cash', valueStreams: 'Customer Acquisition', kpis: 'Customer Churn Rate < 5%' },
      { id: 2, name: 'Supply Chain Management', owner: 'Logistics', criticality: 'Critical', status: 'Active', description: 'Oversees the flow of goods and services.', linkedApps: ['SAP SCM'], compliance: 'Under Review', lastUpdated: '2025-07-20', strategicGoals: 'Optimize Logistics', linkedProcesses: 'Procure-to-Pay', valueStreams: 'Product Delivery', kpis: 'On-time delivery > 98%' },
    ]);
  }
  if (!localStorage.getItem('applications')) {
    saveData('applications', [
      { id: 1, name: 'Salesforce CRM', owner: 'John Doe', technology: 'Salesforce', lifecycle: 'Production', criticality: 'High', status: 'Healthy', compliance: 'Compliant', dependencies: ['SAP SCM'], dependents: [], lastUpdated: '2025-07-28', version: '1.0', integrationProtocol: 'REST', deploymentModel: 'Cloud', dataEntitiesManaged: 'Customer, Contact, Lead', slaDetails: '99.9% uptime', functionalRequirements: 'Manage customer data.', nonFunctionalRequirements: 'High availability.', monthlyCost: 15000, vendor: 'Salesforce', role: 'CRM', zone: 'Cloud:Azure' },
      { id: 2, name: 'SAP SCM', owner: 'Jane Smith', technology: 'SAP', lifecycle: 'Production', criticality: 'Critical', status: 'Warning', compliance: 'Compliant', dependencies: [], dependents: ['Salesforce CRM'], lastUpdated: '2025-07-25', version: '1.2', integrationProtocol: 'SOAP', deploymentModel: 'On-Premise', dataEntitiesManaged: 'Product, Supplier, Inventory', slaDetails: '99.95% uptime', functionalRequirements: 'Track inventory levels.', nonFunctionalRequirements: 'Secure data transmission.', monthlyCost: 25000, vendor: 'SAP', role: 'ERP', zone: 'Corporate IT' },
    ]);
  }
  if (!localStorage.getItem('technologies')) {
    saveData('technologies', [
      { id: 1, name: 'PostgreSQL Server', type: 'Database', category: 'Relational Database', vendor: 'PostgreSQL', version: '15.3', environment: 'Production', location: 'AWS RDS (us-east-1)', status: 'Healthy', compliance: 'Compliant', criticality: 'High', lastUpdated: '2025-07-01', eol: '2028-11-09', eos: '2027-11-09', technicalDebt: 'Low', replacementTech: 'PostgreSQL 16', monthlyCost: 2000, role: 'Database', zone: 'OT Data Center' },
      { id: 2, name: 'Redis Cache', type: 'Cache', category: 'In-Memory Database', vendor: 'Redis', version: '7.0', environment: 'Production', location: 'AWS ElastiCache (us-east-1)', status: 'Healthy', compliance: 'Compliant', criticality: 'Medium', lastUpdated: '2025-06-15', eol: '2026-08-01', eos: '2025-08-01', technicalDebt: 'None', replacementTech: 'Redis 8', monthlyCost: 500, role: 'Cache', zone: 'OT Data Center' },
    ]);
  }
  if (!localStorage.getItem('securityControls')) {
    saveData('securityControls', [
      { id: 1, name: 'Perimeter Firewall', type: 'Firewall', category: 'Network Security', framework: 'NIST CSF', controlId: 'PR.AC-3', status: 'Implemented', compliance: 'Compliant', criticality: 'High', coverage: ['Corporate Network'], nextReview: '2026-01-15', vendor: 'Palo Alto', role: 'Firewall', zone: 'Corporate IT' },
      { id: 2, name: 'DMZ Firewall', type: 'Firewall', category: 'Network Security', framework: 'NIST CSF', controlId: 'PR.AC-4', status: 'Implemented', compliance: 'Compliant', criticality: 'Critical', coverage: ['DMZ'], nextReview: '2026-01-15', vendor: 'Cisco', role: 'Firewall', zone: 'DMZ', tags: ['DMZ'] },
    ]);
  }
  if (!localStorage.getItem('dataDictionary')) {
    saveData('dataDictionary', [
      { id: 1, entity: 'Customer', field: 'customer_id', type: 'UUID', pii: true, dataOwner: 'Sales Dept', masterDataSource: 'Salesforce CRM', qualityMetrics: { completeness: 98, accuracy: 95, freshness: 99 }, integrationMethod: 'Real-time', regulatoryCompliance: 'GDPR', classification: 'Restricted', role: 'Data' },
      { id: 2, entity: 'Customer', field: 'email', type: 'VARCHAR(255)', pii: true, dataOwner: 'Sales Dept', masterDataSource: 'Salesforce CRM', qualityMetrics: { completeness: 90, accuracy: 85, freshness: 92 }, integrationMethod: 'Real-time', regulatoryCompliance: 'GDPR', classification: 'Confidential', role: 'Data' },
      { id: 3, entity: 'Invoice', field: 'invoice_id', type: 'UUID', pii: false, dataOwner: 'Finance Dept', masterDataSource: 'SAP SCM', qualityMetrics: { completeness: 100, accuracy: 99, freshness: 90 }, integrationMethod: 'Batch', regulatoryCompliance: 'None', classification: 'Internal', role: 'Data' },
    ]);
  }
    if (!localStorage.getItem('dataEntities')) {
    saveData('dataEntities', [
      { id: 'customer', name: 'Customer', domain: 'Operations', color: 'bg-blue-500', position: { x: 50, y: 150 } },
      { id: 'asset', name: 'Asset', domain: 'Finance', color: 'bg-green-500', position: { x: 350, y: 50 } },
      { id: 'invoice', name: 'Invoice', domain: 'Finance', color: 'bg-green-500', position: { x: 350, y: 250 } },
      { id: 'employee', name: 'Employee', domain: 'HR', color: 'bg-yellow-500', position: { x: 650, y: 150 } },
    ]);
  }
  if (!localStorage.getItem('entityRelationships')) {
    saveData('entityRelationships', [
      { from: 'customer', to: 'invoice', label: 'generates' },
      { from: 'asset', to: 'invoice', label: 'itemized in' },
      { from: 'employee', to: 'customer', label: 'manages' },
    ]);
  }
  if (!localStorage.getItem('relations')) {
    saveData('relations', [
      { from: 1, to: 2, type: 'uses' }
    ]);
  }
  if (!localStorage.getItem('relationNodes')) {
    saveData('relationNodes', [
      { id: 1, name: 'Salesforce CRM', type: 'Application' },
      { id: 2, name: 'Customer Data', type: 'Data' },
      { id: 3, name: 'PostgreSQL DB', type: 'Technology' },
      { id: 4, name: 'Customer Management', type: 'Business' },
      { id: 5, name: 'Firewall', type: 'Security' },
    ]);
  }
  if (!localStorage.getItem('alerts')) {
    saveData('alerts', [
      { id: 1, message: 'Firewall configuration change detected.', severity: 'Medium', timestamp: '2025-07-29T10:00:00Z', status: 'New' },
      { id: 2, message: 'Unusual login activity for Admin User.', severity: 'Critical', timestamp: '2025-07-28T14:30:00Z', status: 'New' },
      { id: 3, message: 'Database nearing capacity.', severity: 'Low', timestamp: '2025-07-27T18:00:00Z', status: 'Acknowledged' },
      { id: 4, message: 'SAP SCM connection failed.', severity: 'High', timestamp: '2025-07-30T11:00:00Z', status: 'Resolved' },
    ]);
  }
  if (!localStorage.getItem('reports')) {
    saveData('reports', [
      { id: 1, title: 'Q2 Technology Risk Assessment', description: 'Comprehensive risk analysis of all technology assets.', lastGenerated: '2025-07-01', tags: ['Risk', 'Technology', 'Q2'] },
      { id: 2, title: 'Application Lifecycle Summary', description: 'Overview of all applications by lifecycle stage.', lastGenerated: '2025-07-15', tags: ['Applications', 'Lifecycle'] },
      { id: 3, title: 'Q2 Compliance Summary', description: 'Detailed report on security control compliance.', lastGenerated: '2025-07-02', tags: ['Compliance', 'Security', 'Q2'] },
    ]);
  }
  if (!localStorage.getItem('networkInterfaces')) {
    saveData('networkInterfaces', [
      { id: 1, name: 'Auth API', cluster: 'Authentication', endpoint: '/api/auth', method: 'POST', protocol: 'HTTPS', auth: 'Token', securityZone: 'DMZ', throughput: '100ms' },
    ]);
  }
  if (!localStorage.getItem('dataFlows')) {
    saveData('dataFlows', [
      { id: 1, from: 'ERP', to: 'Data Warehouse', type: 'ETL', protocol: 'Batch', pii: false },
      { id: 2, from: 'CRM', to: 'Data Warehouse', type: 'ETL', protocol: 'Batch', pii: true },
      { id: 3, from: 'Web App', to: 'CRM', type: 'API', protocol: 'Real-time', pii: true },
      { id: 4, from: 'Vulnerability Scanner', to: 'Security Arch', type: 'API', protocol: 'Real-time', pii: false },
    ]);
  }
  if (!localStorage.getItem('networkComponents')) {
    saveData('networkComponents', [
      { id: 1, name: 'Frontend LB', component: 'Nginx', type: 'LoadBalancer', port: 80, protocol: 'HTTP', zone: 'DMZ', topology: 'VLAN10 / 192.168.1.0/24', firewallRules: 'Allow 443 from ANY', vendor: 'Nginx', role: 'Load Balancer' },
    ]);
  }
  if (!localStorage.getItem('networkDependencies')) {
    saveData('networkDependencies', [
      { id: 1, application: 'Frontend', depends_on: 'BackendAPI', interface: '/api/dashboard' },
    ]);
  }
  if (!localStorage.getItem('networkSecurity')) {
    saveData('networkSecurity', [
      { id: 1, interface: '/api/secure', security: 'Token+HTTPS', compliance: 'GDPR' },
    ]);
  }
  if (!localStorage.getItem('infrastructure')) {
    saveData('infrastructure', [
      { id: 1, name: 'Backend Server', type: 'Virtual', specs: '4CPU/8GB', location: 'Cloud', vendor: 'Amazon', os: 'Linux', lifecycle: 'Active', cost: 150, risk: 'None', contract: { number: 'C-123', name: 'AWS Enterprise', startDate: '2025-01-01', endDate: '2026-01-01' }, supportedCapabilities: [1], dataCenter: 'us-east-1', resourceUtilization: { cpu: '60', memory: '75', storage: '50' }, haDrStatus: 'Active/Active', iacLink: 'github.com/repo/terraform', deploymentType: 'Public Cloud', role: 'Web Server', zone: 'Cloud:IBM' },
      { id: '2', name: 'Historian Server', type: 'Virtual', vendor: 'Dell', os: 'Windows Server', lifecycle: 'Active', role: 'Historian', zone: 'OT Data Center' },
      { id: '3', name: 'PLC-101', type: 'Physical', vendor: 'Siemens', os: 'N/A', lifecycle: 'Active', role: 'PLC', zone: 'OT Systems Infrastructure' },
    ]);
  }
  if (!localStorage.getItem('generatedInsights')) {
    saveData('generatedInsights', []);
  }
  if (!localStorage.getItem('scenarios')) {
    saveData('scenarios', [
      { id: 1, name: 'Cloud Migration 2025', description: 'Migrate on-premise CRM and ERP to Azure.', startDate: '2025-01-01', endDate: '2025-12-31', status: 'In Progress' },
      { id: 2, name: 'Data Warehouse Overhaul', description: 'Replace legacy DWH with a modern cloud-native solution.', startDate: '2025-06-01', endDate: '2026-06-30', status: 'Planned' },
    ]);
  }
  if (!localStorage.getItem('decisions')) {
    saveData('decisions', [
      { id: 1, title: 'Adopt PostgreSQL for all new services', status: 'Decided', linkedItems: ['PostgreSQL Server'], rationale: 'Standardize DB stack for cost and maintenance efficiency.', timestamp: new Date('2025-05-20').toISOString() },
      { id: 2, title: 'Deprecate legacy Java Monolith', status: 'In Progress', linkedItems: ['Legacy CRM'], rationale: 'High maintenance cost and scalability issues.', timestamp: new Date('2025-03-10').toISOString() },
    ]);
  }
   if (!localStorage.getItem('icsZones')) {
    saveData('icsZones', [
        { id: '1', name: 'Corporate IT', description: 'Main corporate information technology zone.' },
        { id: '2', name: 'OT Systems Infrastructure', description: 'Operational Technology core infrastructure.' },
        { id: '3', name: 'OT Data Center', description: 'Data center hosting OT systems.' },
        { id: '4', name: 'Remote Engineering', description: 'Zone for remote access and engineering workstations.' },
        { id: '5', name: 'Wireless', description: 'Wireless network segments for operational use.' },
        { id: '6', name: 'DMZ', description: 'Demilitarized Zone between IT and OT networks.' },
        { id: '7', name: 'Cloud:Azure', description: 'Microsoft Azure cloud environment.' },
        { id: '8', name: 'Cloud:IBM', description: 'IBM Cloud environment.' },
    ]);
  }
  if (!localStorage.getItem('icsLevelRules')) {
    saveData('icsLevelRules', [
        { id: '1', name: 'Cloud Services', priority: 10, is_enabled: true, conditions: [{ field: 'deploymentModel', operator: 'equals', value: 'Cloud' }], ics_level: 4 },
        { id: '2', name: 'DMZ by Tag', priority: 20, is_enabled: true, conditions: [{ field: 'tags', operator: 'contains', value: 'DMZ' }], ics_level: 3.5, zoneName: 'DMZ' },
        { id: '3', name: 'DMZ by Zone', priority: 21, is_enabled: true, conditions: [{ field: 'zone', operator: 'equals', value: 'DMZ' }], ics_level: 3.5 },
        { id: '4', name: 'OT MES/Historian/Eng', priority: 30, is_enabled: true, conditions: [{ field: 'role', operator: 'in', value: 'MES,Historian,Engineering Workstation' }], ics_level: 3, zoneName: 'OT Data Center' },
        { id: '5', name: 'SCADA/HMI', priority: 40, is_enabled: true, conditions: [{ field: 'role', operator: 'in', value: 'SCADA,HMI' }], ics_level: 2, zoneName: 'OT Systems Infrastructure' },
        { id: '6', name: 'PLC/RTU', priority: 50, is_enabled: true, conditions: [{ field: 'role', operator: 'in', value: 'PLC,RTU' }], ics_level: 1, zoneName: 'OT Systems Infrastructure' },
        { id: '7', name: 'Field Devices', priority: 60, is_enabled: true, conditions: [{ field: 'role', operator: 'in', value: 'Sensor,Actuator' }], ics_level: 0, zoneName: 'OT Systems Infrastructure' },
    ]);
  }
  if (!localStorage.getItem('aggregatedIcsComponents')) {
    saveData('aggregatedIcsComponents', []);
  }
  if (!localStorage.getItem('aggregatedIcsEdges')) {
    saveData('aggregatedIcsEdges', []);
  }
  if (!localStorage.getItem('icsNotes')) {
    saveData('icsNotes', []);
  }
};

const checkCondition = (componentValue, operator, ruleValue) => {
  if (componentValue === undefined || componentValue === null) return false;

  const compStr = String(componentValue).toLowerCase();
  const ruleStr = String(ruleValue).toLowerCase();

  switch (operator) {
    case 'equals':
      return compStr === ruleStr;
    case 'contains':
      if(Array.isArray(componentValue)) {
        return componentValue.map(v => String(v).toLowerCase()).includes(ruleStr);
      }
      return compStr.includes(ruleStr);
    case 'in':
      const ruleValues = ruleStr.split(',').map(s => s.trim());
      return ruleValues.includes(compStr);
    default:
      return false;
  }
};

const normalize = (value, fallback = 'N/A') => value || fallback;

export const runIcsAggregation = (allData, rules, zones) => {
  const components = [];
  const edges = [];

  const zoneSet = new Set((zones || []).map(z => z.name));
  const canon = {
    domain: v => (v || '').trim(),
    zone: v => {
      const z = (v || '').trim();
      return zoneSet.has(z) ? z : z;
    },
    role: v => (v || '').toString().trim().toLowerCase(),
    vendor: v => (v || '').trim() || null,
    name: v => (v || '').toString().trim(),
  };

  const mkId = (st, raw) => `${st.slice(0,4)}-${String(raw)}`;
  const nowIso = () => new Date().toISOString();
  const asNum = (n) => (n === null || n === undefined || n === '' ? null : Number(n));

  const sources = {
    Applications: allData.applications || [],
    Technologies: allData.technologies || [],
    Infrastructure: allData.infrastructure || [],
    Security: allData.securityControls || [],
    Network: allData.networkComponents || [],
    Data: allData.dataDictionary || [],
  };

  const sortedRules = (rules || []).filter(r => r.is_enabled !== false).sort((a,b) => (a.priority||0) - (b.priority||0));

  const checkCond = (val, op, exp) => {
    if (val === undefined || val === null) return false;
    const v = String(val).toLowerCase();
    const e = String(exp).toLowerCase();
    switch (op) {
      case 'equals': return v === e;
      case 'contains': return v.includes(e);
      case 'in': {
        const arr = e.split(',').map(s => s.trim().toLowerCase());
        return arr.includes(v);
      }
      default: return false;
    }
  };

  const applyRules = (record) => {
    for (const rule of sortedRules) {
      const ok = (rule.conditions || []).every(c => {
        const field = c.field;
        const value = record[field] ?? record.source_data?.[field];
        return checkCond(value, c.operator, c.value);
      });
      if (ok) return asNum(rule.ics_level);
    }
    return null;
  };

  const fallbackLevel = (zone, role) => {
    const z = (zone || '').toLowerCase();
    const r = (role || '').toLowerCase();
    if (z.startsWith('cloud:')) return 4;
    if (z === 'dmz') return 3.5;
    if (z.includes('ot data center') || z.includes('ot systems infrastructure')) return 3;
    if (['scada','hmi'].includes(r)) return 2;
    if (['plc','rtu','controller'].includes(r)) return 1;
    if (['sensor','actuator'].includes(r)) return 0;
    return null;
  };

  Object.entries(sources).forEach(([sourceType, items]) => {
    items.forEach(item => {
      const domain = sourceType;
      const zone = canon.zone(item.zone || item.zoneName || '');
      const role = canon.role(item.role || item.type || item.category);
      const vendor = canon.vendor(item.vendor);
      const name = canon.name(item.name || item.title || `${sourceType} ${item.id}`);

      const base = {
        id: mkId(sourceType, item.id),
        source_type: sourceType,
        source_id: item.id,
        name,
        domain,
        zone,
        role,
        vendor,
        tags: Array.isArray(item.tags) ? item.tags : [],
        status: item.status || null,
        product: item.product || item.type || null,
        version: item.version || null,
        source_data: item,
        last_aggregated_at: nowIso(),
      };

      let level = applyRules({ ...base, ...item });
      if (level === null) level = fallbackLevel(base.zone, base.role);

      components.push({ ...base, ics_level: level });
    });
  });

  const pushEdge = (fromId, toId, label) => {
    if (!fromId || !toId || fromId === toId) return;
    const id = `${fromId}__${toId}`;
    if (!edges.some(e => e.id === id)) {
      edges.push({ id, from_id: fromId, to_id: toId, label: label || '' });
    }
  };

  (allData.relations || []).forEach(r => {
    pushEdge(mkId(r.from_domain || 'Applications', r.from), mkId(r.to_domain || 'Technologies', r.to), r.type);
  });
  (allData.networkDependencies || []).forEach(d => {
    pushEdge(mkId('Network', d.from), mkId('Network', d.to), d.protocol || d.method);
  });
  (allData.dataFlows || []).forEach(f => {
    pushEdge(mkId('Applications', f.from), mkId('Applications', f.to), f.type || f.protocol);
  });

  const lastRun = components.reduce((acc, c) => {
    const t = Date.parse(c.last_aggregated_at) || 0;
    return t > acc ? t : acc;
  }, 0);

  return {
    components,
    edges,
    status: {
      lastRun: new Date(lastRun || Date.now()).toISOString(),
      processed: components.length,
      unclassified: components.filter(c => c.ics_level === null || c.ics_level === undefined).length,
      errors: 0,
    }
  };
};;

export const getCapabilities = () => getInitialData('capabilities', []);
export const getApplications = () => getInitialData('applications', []);
export const getTechnologies = () => getInitialData('technologies', []);
export const getSecurityControls = () => getInitialData('securityControls', []);
export const getDataDictionary = () => getInitialData('dataDictionary', []);
export const getRelations = () => getInitialData('relations', []);
export const getRelationNodes = () => getInitialData('relationNodes', []);
export const getUsers = () => getInitialData('users', []);
export const getRoles = () => getInitialData('roles', []);
export const getAlerts = () => getInitialData('alerts', []);
export const getReports = () => getInitialData('reports', []);
export const getNetworkInterfaces = () => getInitialData('networkInterfaces', []);
export const getDataFlows = () => getInitialData('dataFlows', []);
export const getNetworkComponents = () => getInitialData('networkComponents', []);
export const getNetworkDependencies = () => getInitialData('networkDependencies', []);
export const getNetworkSecurity = () => getInitialData('networkSecurity', []);
export const getInfrastructure = () => getInitialData('infrastructure', []);
export const getGeneratedInsights = () => getInitialData('generatedInsights', []);
export const getScenarios = () => getInitialData('scenarios', []);
export const getDecisions = () => getInitialData('decisions', []);
export const getDataEntities = () => getInitialData('dataEntities', []);
export const getEntityRelationships = () => getInitialData('entityRelationships', []);
export const getIcsLevelRules = () => getInitialData('icsLevelRules', []);
export const getIcsZones = () => getInitialData('icsZones', []);
export const getIcsNotes = () => getInitialData('icsNotes', []);
export const getAggregatedIcsComponents = () => getInitialData('aggregatedIcsComponents', []);
export const getAggregatedIcsEdges = () => getInitialData('aggregatedIcsEdges', []);
