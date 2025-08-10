import { z } from 'zod';

export const icsZoneSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Zone name is required'),
  description: z.string().optional(),
});

export const icsLevelRuleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Rule name is required'),
  priority: z.number().int().min(1, 'Priority must be at least 1'),
  is_enabled: z.boolean().default(true),
  conditions: z.array(z.object({
    field: z.string().min(1, 'Condition field is required'),
    operator: z.enum(['equals', 'contains', 'in']),
    value: z.string().min(1, 'Condition value is required'),
  })).min(1, 'At least one condition is required'),
  ics_level: z.number({ required_error: "ICS Level is required"}).min(0).max(5),
  zoneName: z.string().optional(),
});

export const icsNoteSchema = z.object({
    id: z.string().optional(),
    note_text: z.string().min(1, "Note text cannot be empty"),
    target_id: z.string(),
    target_type: z.enum(['node', 'edge']),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }).optional(),
});

export const aggregatedIcsComponentSchema = z.object({
  id: z.string(),
  source_type: z.string(),
  source_id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  domain: z.string().optional(),
  vendor: z.string().optional(),
  product: z.string().optional(),
  version: z.string().optional(),
  zone_id: z.string().optional().nullable(),
  zoneName: z.string().optional().nullable(),
  ics_level: z.number().nullable(),
  tags: z.array(z.string()).optional(),
  criticality: z.string().optional(),
  status: z.string().optional(),
  source_data: z.record(z.any()),
  last_aggregated_at: z.string(),
});