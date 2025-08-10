import { z } from 'zod';

export const dataDictionarySchema = z.object({
  id: z.string().optional(),
  entity: z.string().min(1, "Entity is required"),
  field: z.string().min(1, "Field is required"),
  description: z.string().optional(),
  type: z.string().default('VARCHAR'),
  pii: z.boolean().default(false),
  dataOwner: z.string().optional(),
  masterDataSource: z.string().optional(),
  regulatoryCompliance: z.enum(["None", "GDPR", "CCPA", "HIPAA"]).default("None"),
  classification: z.enum(["Public", "Internal", "Confidential", "Restricted"]).default("Public"),
});

export const dataDictionaryFields = {
  entity: { label: "Entity", type: "text", required: true },
  field: { label: "Field", type: "text", required: true },
  description: { label: "Description", type: "textarea" },
  type: { label: "Data Type", type: "text" },
  pii: { label: "Contains PII", type: "checkbox" },
  dataOwner: { label: "Data Owner", type: "text" },
  masterDataSource: { label: "Master Data Source", type: "text" },
  regulatoryCompliance: { label: "Regulatory Compliance", type: "select", options: ["None", "GDPR", "CCPA", "HIPAA"] },
  classification: { label: "Classification", type: "select", options: ["Public", "Internal", "Confidential", "Restricted"] },
};