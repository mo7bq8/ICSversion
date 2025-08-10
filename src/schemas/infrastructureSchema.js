import { z } from 'zod';

export const infrastructureSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["Physical", "Virtual", "Container", "DBaaS", "PaaS", "SaaS"]).default("Virtual"),
  specs: z.string().optional(),
  location: z.string().optional(),
  vendor: z.string().optional(),
  os: z.string().optional(),
  lifecycle: z.enum(["Active", "End-of-life", "Planned", "Retired"]).default("Active"),
  cost: z.number().default(0),
  risk: z.string().default("None"),
  contract: z.object({
    number: z.string().optional(),
    name: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }).default({}),
  supportedCapabilities: z.array(z.string()).default([]),
  dataCenter: z.string().optional(),
  resourceUtilization: z.object({
    cpu: z.string().optional(),
    memory: z.string().optional(),
    storage: z.string().optional(),
  }).default({}),
  haDrStatus: z.string().default("N/A"),
  iacLink: z.string().optional(),
  deploymentType: z.enum(["On-Prem", "Private Cloud", "Public Cloud", "Hybrid"]).default("Public Cloud"),
});