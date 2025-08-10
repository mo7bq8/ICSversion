import { z } from 'zod';

export const capabilitySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Capability name is required." }),
  owner: z.string().min(1, { message: "Owner is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  criticality: z.enum(["Critical", "High", "Medium", "Low"]).default("Medium"),
  status: z.enum(["Active", "Under Review", "Development", "Deprecated"]).default("Active"),
  linkedApps: z.array(z.string()).default([]),
  compliance: z.enum(["Compliant", "Non-Compliant", "Under Review"]).default("Under Review"),
  strategicGoals: z.string().optional(),
  linkedProcesses: z.string().optional(),
  valueStreams: z.string().optional(),
  kpis: z.string().optional(),
});

export const capabilityFields = {
  name: { label: "Capability Name", type: "text", required: true },
  owner: { label: "Owner", type: "text", required: true },
  description: { label: "Description", type: "textarea", required: true },
  linkedApps: { label: "Linked Applications", type: "multiselect", options: [] }, // Options populated dynamically
  criticality: { label: "Criticality", type: "select", options: ["Critical", "High", "Medium", "Low"] },
  status: { label: "Status", type: "select", options: ["Active", "Under Review", "Development", "Deprecated"] },
  strategicGoals: { label: "Strategic Goals Alignment", type: "text" },
  linkedProcesses: { label: "Linked Business Processes", type: "text" },
  valueStreams: { label: "Value Streams", type: "text" },
  kpis: { label: "KPIs/Metrics", type: "text" },
};