import { z } from 'zod';

export const applicationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Application name is required." }),
  lifecycle: z.enum(["Production", "Development", "Testing", "Deprecated"]).default("Production"),
  version: z.string().min(1, { message: "Version is required." }),
  owner: z.string().min(1, { message: "Owner is required." }),
  technology: z.string().optional(),
  dependencies: z.array(z.string()).default([]),
  criticality: z.enum(["Critical", "High", "Medium", "Low"]).default("Medium"),
  status: z.enum(["Healthy", "Warning", "Critical", "Development", "End of Life"]).default("Healthy"),
  compliance: z.enum(["Compliant", "Non-Compliant", "Under Review"]).default("Compliant"),
  integrationProtocol: z.enum(["REST", "SOAP", "GraphQL", "Other"]).default("REST"),
  deploymentModel: z.enum(["Cloud", "On-Premise", "Hybrid"]).default("Cloud"),
  dataEntitiesManaged: z.string().optional(),
  slaDetails: z.string().optional(),
  functionalRequirements: z.string().optional(),
  nonFunctionalRequirements: z.string().optional(),
  lastUpdated: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }).optional(),
});

export const applicationFields = {
  name: { label: "Application Name", type: "text", required: true },
  version: { label: "Version", type: "text", required: true },
  owner: { label: "Owner", type: "text", required: true },
  technology: { label: "Technology", type: "text" },
  lastUpdated: { label: "Last Updated", type: "date" },
  dependencies: { label: "Dependencies", type: "multiselect", options: [] }, // Options populated dynamically
  lifecycle: { label: "Lifecycle", type: "select", options: ["Production", "Development", "Testing", "Deprecated"] },
  criticality: { label: "Criticality", type: "select", options: ["Critical", "High", "Medium", "Low"] },
  integrationProtocol: { label: "Integration Protocol", type: "select", options: ["REST", "SOAP", "GraphQL", "Other"] },
  deploymentModel: { label: "Deployment Model", type: "select", options: ["Cloud", "On-Premise", "Hybrid"] },
  dataEntitiesManaged: { label: "Data Entities Managed", type: "text" },
  slaDetails: { label: "SLA Details", type: "text" },
  functionalRequirements: { label: "Functional Requirements", type: "textarea" },
  nonFunctionalRequirements: { label: "Non-Functional Requirements", type: "textarea" },
};