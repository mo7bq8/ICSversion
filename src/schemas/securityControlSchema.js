import { z } from 'zod';

export const securityControlSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Control name is required"),
  type: z.enum(["Access Control", "Data Protection", "Network Security", "Risk Management", "Incident Management"]).default("Access Control"),
  category: z.string().optional(),
  framework: z.string().default("NIST CSF"),
  controlId: z.string().optional(),
  status: z.enum(["Implemented", "Partially Implemented", "Not Implemented", "Under Review"]).default("Implemented"),
  compliance: z.enum(["Compliant", "Non-Compliant", "Under Review"]).default("Compliant"),
  criticality: z.enum(["Critical", "High", "Medium", "Low"]).default("Medium"),
  coverage: z.array(z.string()).default([]),
  nextReview: z.string().refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid date" }).optional(),
});

export const securityControlFields = {
  name: { label: "Control Name", type: "text", required: true },
  type: { label: "Type", type: "select", options: ["Access Control", "Data Protection", "Network Security", "Risk Management", "Incident Management"] },
  category: { label: "Category", type: "text" },
  framework: { label: "Framework", type: "text" },
  controlId: { label: "Control ID", type: "text" },
  status: { label: "Status", type: "select", options: ["Implemented", "Partially Implemented", "Not Implemented", "Under Review"] },
  compliance: { label: "Compliance", type: "select", options: ["Compliant", "Non-Compliant", "Under Review"] },
  nextReview: { label: "Next Review Date", type: "date" },
};