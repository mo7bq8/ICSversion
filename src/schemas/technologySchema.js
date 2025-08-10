import { z } from 'zod';

export const technologySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Asset name is required." }),
  type: z.enum(["Database", "Network", "Platform", "Cache", "Storage", "Server"]).default("Server"),
  category: z.string().optional(),
  vendor: z.string().optional(),
  version: z.string().optional(),
  environment: z.enum(["Production", "Development", "Testing"]).default("Production"),
  location: z.string().optional(),
  status: z.enum(["Healthy", "Warning", "Critical", "EOL"]).default("Healthy"),
  compliance: z.enum(["Compliant", "Non-Compliant", "Under Review"]).default("Compliant"),
  criticality: z.enum(["Critical", "High", "Medium", "Low"]).default("Medium"),
  eol: z.string().refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid date" }).optional(),
  eos: z.string().refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid date" }).optional(),
  technicalDebt: z.string().optional(),
  replacementTech: z.string().optional(),
  usageMetrics: z.string().optional(),
  licensingDetails: z.string().optional(),
  vulnerabilityStatus: z.enum(["None", "Low", "Medium", "High", "Critical"]).default("None"),
});

export const technologyFields = {
  name: { label: "Asset Name", type: "text", required: true },
  type: { label: "Type", type: "select", options: ["Database", "Network", "Platform", "Cache", "Storage", "Server"] },
  category: { label: "Category", type: "text" },
  vendor: { label: "Vendor", type: "text" },
  version: { label: "Version", type: "text" },
  eol: { label: "End-of-Life Date", type: "date" },
  eos: { label: "End-of-Support Date", type: "date" },
  technicalDebt: { label: "Technical Debt (Cost/Risk)", type: "text" },
  replacementTech: { label: "Replacement Tech/Version", type: "text" },
  usageMetrics: { label: "Usage Metrics (%)", type: "text" },
  vulnerabilityStatus: { label: "Vulnerability Status", type: "select", options: ["None", "Low", "Medium", "High", "Critical"] },
  licensingDetails: { label: "Licensing Details", type: "textarea" },
};