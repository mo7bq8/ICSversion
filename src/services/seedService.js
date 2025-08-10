import { saveData, initializeDefaultData, getRoles as getInitialRoles } from './dataService';

const NAMES = ['John Doe', 'Jane Smith', 'Peter Jones', 'Mary Williams', 'David Brown', 'Susan Miller', 'Michael Davis', 'Linda Garcia', 'James Wilson', 'Patricia Martinez'];
const VENDORS = ['Palo Alto', 'Cisco', 'Juniper', 'Fortinet', 'Checkpoint', 'Broadcom', 'CrowdStrike', 'Okta', 'Zscaler'];
const APP_NAMES = ['CRM Pro', 'ERP Ultimate', 'HR Connect', 'FinancePlus', 'Logistics Hub', 'Marketing Suite', 'Sales Tracker', 'Inventory Master', 'Support Desk', 'Project Phoenix'];
const TECH_NAMES = ['Oracle DB', 'PostgreSQL', 'MongoDB', 'Redis', 'Kafka', 'RabbitMQ', 'Nginx', 'Apache Tomcat', 'Kubernetes', 'Docker'];
const INFRA_NAMES = ['Web Server', 'App Server', 'DB Server', 'Cache Server', 'API Gateway', 'Load Balancer', 'Message Broker', 'File Storage'];
const CAPABILITY_NAMES = ['Customer Management', 'Financial Planning', 'Supply Chain', 'Human Resources', 'Product Development', 'Marketing & Sales', 'IT Operations', 'Risk Management'];
const ZONES = ['Corporate IT', 'OT Systems Infrastructure', 'OT Data Center', 'Remote Engineering', 'Wireless', 'DMZ', 'Cloud:Azure', 'Cloud:IBM'];

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const toID = (str) => str.toLowerCase().replace(/\s+/g, '-');

let seedDataCache = null;

const generateSeedData = () => {
    if (seedDataCache) return seedDataCache;

    const capabilities = Array.from({ length: 35 }, (_, i) => {
        const name = `${randomChoice(CAPABILITY_NAMES)} ${i + 1}`;
        return {
            id: toID(name),
            name,
            owner: randomChoice(NAMES),
            criticality: randomChoice(['Critical', 'High', 'Medium', 'Low']),
            status: randomChoice(['Active', 'Under Review', 'Development']),
            description: `Manages ${name.toLowerCase()}.`,
            linkedApps: [],
            compliance: randomChoice(['Compliant', 'Under Review', 'Non-Compliant']),
            strategicGoals: `Goal ${i % 5 + 1}`,
            linkedProcesses: `Process ${i % 10 + 1}`,
            valueStreams: `Stream ${i % 3 + 1}`,
            kpis: `KPI ${i % 8 + 1}`
        };
    });

    const applications = Array.from({ length: 40 }, (_, i) => {
        const name = `${randomChoice(APP_NAMES)} v${i + 1}`;
        const app = {
            id: toID(name),
            name,
            owner: randomChoice(NAMES),
            technology: randomChoice(TECH_NAMES),
            lifecycle: randomChoice(['Production', 'Development', 'Testing', 'Deprecated']),
            criticality: randomChoice(['Critical', 'High', 'Medium', 'Low']),
            status: randomChoice(['Healthy', 'Warning', 'Critical']),
            compliance: randomChoice(['Compliant', 'Under Review']),
            dependencies: [],
            version: `${randomInt(1, 5)}.${randomInt(0, 9)}.${randomInt(0, 20)}`,
            integrationProtocol: randomChoice(['REST', 'SOAP', 'GraphQL']),
            deploymentModel: randomChoice(['Cloud', 'On-Premise', 'Hybrid']),
            dataEntitiesManaged: `Customer, Order`,
            slaDetails: '99.9% uptime',
            functionalRequirements: 'Core business functions.',
            nonFunctionalRequirements: 'High availability.',
            capex: randomInt(10000, 50000),
            opex: randomInt(1000, 5000),
            go_live_date: randomDate(new Date(2018, 0, 1), new Date(2023, 11, 31)).toISOString().split('T')[0],
            retirement_date: randomChoice([null, randomDate(new Date(2025, 0, 1), new Date(2030, 11, 31)).toISOString().split('T')[0]]),
            role: randomChoice(['CRM', 'ERP', 'HMI', 'SCADA', 'MES', 'Historian']),
            zone: randomChoice(ZONES),
        };
        const cap = randomChoice(capabilities);
        cap.linkedApps.push(app.name);
        return app;
    });

    applications.forEach(app => {
        if (Math.random() > 0.5) {
            const dep = randomChoice(applications.filter(a => a.id !== app.id));
            if (dep) app.dependencies.push(dep.name);
        }
    });

    const technologies = Array.from({ length: 60 }, (_, i) => {
        const name = `${randomChoice(TECH_NAMES)} ${i + 1}`;
        return {
            id: toID(name),
            name,
            type: randomChoice(['Database', 'Network', 'Platform', 'Cache', 'Storage', 'Server']),
            category: 'Core Infrastructure',
            vendor: randomChoice(VENDORS),
            version: `${randomInt(2, 15)}.${randomInt(0, 9)}`,
            environment: randomChoice(['Production', 'Development', 'Testing']),
            location: 'Data Center 1',
            status: randomChoice(['Healthy', 'Warning', 'EOL']),
            compliance: 'Compliant',
            criticality: randomChoice(['High', 'Medium', 'Low']),
            eol: randomDate(new Date(2024, 0, 1), new Date(2030, 11, 31)).toISOString().split('T')[0],
            eos: randomDate(new Date(2023, 0, 1), new Date(2028, 11, 31)).toISOString().split('T')[0],
            technicalDebt: 'Low',
            vulnerabilityStatus: randomChoice(['None', 'Low', 'Medium']),
            role: randomChoice(['Database', 'Web Server', 'Message Queue']),
            zone: randomChoice(ZONES),
        };
    });

    const infrastructure = Array.from({ length: 45 }, (_, i) => {
        const name = `${randomChoice(INFRA_NAMES)} ${i + 1}`;
        return {
            id: toID(name),
            name,
            type: randomChoice(['Virtual', 'Physical', 'Container']),
            specs: `${randomChoice([2, 4, 8, 16])}CPU/${randomChoice([8, 16, 32, 64])}GB`,
            location: 'Data Center 1',
            vendor: 'Dell/HP/Cisco',
            os: randomChoice(['Linux', 'Windows Server']),
            lifecycle: 'Active',
            cost: randomInt(100, 1000),
            risk: 'None',
            dataCenter: randomChoice(['us-east-1', 'eu-west-2', 'On-Prem DC1']),
            deploymentType: randomChoice(['On-Prem', 'Private Cloud', 'Public Cloud']),
            role: randomChoice(['Web Server', 'DB Server', 'PLC', 'RTU', 'Engineering Workstation']),
            zone: randomChoice(ZONES),
            tags: [randomChoice(['ICS', 'Corporate', 'Shared'])],
        };
    });
    
    // Add ICS-relevant cloud services to infrastructure
    Array.from({ length: 20 }, (_, i) => {
        infrastructure.push({
            id: toID(`Cloud Service ${i}`),
            name: `Cloud Service ${i}`,
            type: randomChoice(['PaaS', 'SaaS', 'DBaaS']),
            location: 'Cloud',
            vendor: randomChoice(['AWS', 'Azure', 'GCP', 'IBM']),
            os: 'N/A',
            lifecycle: 'Active',
            cost: randomInt(500, 2000),
            risk: 'Low',
            deploymentModel: 'Cloud',
            role: 'Cloud Service',
            zone: `Cloud:${randomChoice(['Azure', 'IBM'])}`,
        });
    });

    const networkComponents = Array.from({ length: 30 }, (_, i) => ({
        id: toID(`NetComp ${i}`),
        name: `Router/Switch ${i + 1}`,
        component: randomChoice(['Router', 'Switch', 'AP']),
        type: 'Hardware',
        port: 443,
        protocol: 'HTTPS',
        zone: randomChoice(ZONES),
        vendor: randomChoice(VENDORS),
        role: randomChoice(['Router', 'Switch', 'Access Point']),
    }));

    const dataEntities = Array.from({ length: 30 }, (_, i) => ({
        id: toID(`Entity ${i}`),
        entity: `Data Entity ${i + 1}`,
        field: `field_${i}`,
        type: 'VARCHAR',
        pii: Math.random() > 0.7,
        dataOwner: randomChoice(NAMES),
        masterDataSource: randomChoice(applications).name,
        classification: randomChoice(['Public', 'Internal', 'Confidential']),
        role: 'Data'
    }));

    const dataFlows = Array.from({ length: 60 }, (_, i) => {
        const fromApp = randomChoice(applications);
        const toApp = randomChoice(applications.filter(a => a.id !== fromApp.id));
        return {
            id: toID(`Flow ${i}`),
            from: fromApp.name,
            to: toApp.name,
            type: 'API Call',
            protocol: 'Real-time',
            pii: Math.random() > 0.8
        };
    });

    const securityControls = Array.from({ length: 25 }, (_, i) => ({
        id: toID(`Control ${i}`),
        name: `Security Control ${i + 1}`,
        type: randomChoice(['Firewall', 'IDS/IPS', 'AV', 'WAF', 'Gateway']),
        category: 'Network Security',
        framework: 'NIST CSF',
        controlId: `PR.AC-${i + 1}`,
        status: 'Implemented',
        compliance: randomChoice(['Compliant', 'Under Review']),
        criticality: 'High',
        coverage: [randomChoice(ZONES)],
        nextReview: '2026-01-01',
        vendor: randomChoice(VENDORS),
        role: 'Firewall',
        zone: randomChoice(ZONES),
    }));
    
    const modules = ["Business Capabilities", "Application Architecture", "Technology Architecture", "Infrastructure Architecture", "Network Architecture", "Data Architecture", "Security Architecture", "Scenario Planning", "Decision Log", "ICS Levels"];

    const users = [
        { id: 101, name: 'Admin', email: 'admin@demo.com', password: 'password', role: 'Administrator', pageAccess: [], status: 'Active' },
        { id: 102, name: 'Architect', email: 'architect@demo.com', password: 'password', role: 'Enterprise Architect', pageAccess: [], status: 'Active' },
        { id: 103, name: 'Viewer', email: 'viewer@demo.com', password: 'password', role: 'Viewer', pageAccess: [], status: 'Active' },
        { id: 104, name: 'Master User', email: 'master@demo.com', password: 'password', role: 'Master', pageAccess: modules, status: 'Active' },
        ...Array.from({ length: 4 }, (_, i) => ({
             id: 105 + i,
             name: `User ${i+1}`,
             email: `user${i+1}@demo.com`,
             password: 'password',
             role: randomChoice(['Viewer', 'Enterprise Architect']),
             status: 'Active',
             pageAccess: [],
        })),
    ];
    
    users.forEach(user => {
      if(user.role === "Master") {
        user.pageAccess = modules;
      } else if (user.role === "Administrator" || user.role === "Enterprise Architect"){
        user.pageAccess = modules.filter(() => Math.random() > 0.2);
      } else {
        user.pageAccess = modules.filter(() => Math.random() > 0.8);
      }
    });

    const roles = getInitialRoles();

    seedDataCache = {
        capabilities,
        applications,
        technologies,
        infrastructure,
        networkComponents,
        dataDictionary: dataEntities,
        dataFlows,
        securityControls,
        users,
        roles,
    };
    return seedDataCache;
};

export const seedData = (dataContext) => {
    const seed = generateSeedData();
    const dataKeys = Object.keys(seed);
    const errors = [];
    let totalFields = 0;
    let populatedFields = 0;

    dataKeys.forEach(key => {
        const bulkAddFn = dataContext[`bulkAdd${key.charAt(0).toUpperCase() + key.slice(1)}`];
        if (bulkAddFn) {
            bulkAddFn(seed[key]);
        } else {
             // For users, we add them one by one
            if (key === 'users') {
                 seed.users.forEach(u => dataContext.addUser(u));
            } else {
                errors.push(`Could not find bulk add function for ${key}`);
            }
        }
        
        // Calculate completion
        seed[key].forEach(item => {
            const fields = Object.keys(item);
            totalFields += fields.length;
            populatedFields += fields.filter(f => item[f] !== null && item[f] !== undefined && item[f] !== '').length;
        });
    });

    return {
        counts: Object.fromEntries(dataKeys.map(key => [key, seed[key].length])),
        completionPercentage: totalFields > 0 ? Math.round((populatedFields / totalFields) * 100) : 0,
        errors,
    };
};

export const resetData = (dataContext) => {
    localStorage.clear();
    initializeDefaultData();

    // This is a simplified way to trigger a state update in the context.
    const emptySeed = {
        capabilities: [], applications: [], technologies: [], infrastructure: [],
        networkComponents: [], dataDictionary: [], dataFlows: [], securityControls: [], users: [], roles: []
    };
    Object.keys(emptySeed).forEach(key => {
        const bulkAddFn = dataContext[`bulkAdd${key.charAt(0).toUpperCase() + key.slice(1)}`];
        if (bulkAddFn) {
            bulkAddFn([]); // Clear the data
        }
    });
};

export const getSeedDataAsJson = () => {
    return generateSeedData();
};

export const getSeedDataAsCsv = () => {
    const data = generateSeedData();
    // Don't export roles as it's more static
    const { roles, ...exportableData } = data;
    return exportableData;
};