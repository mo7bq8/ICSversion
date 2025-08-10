import { z } from 'zod';

export const interfaceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  cluster: z.string().optional(),
  endpoint: z.string().optional(),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]).optional(),
  protocol: z.enum(["HTTPS", "HTTP", "WebSocket"]).optional(),
  auth: z.string().optional(),
  securityZone: z.enum(["DMZ", "Internal", "External"]).optional(),
});

export const dataFlowSchema = z.object({
  id: z.string().optional(),
  from: z.string().min(1, "Source is required"),
  to: z.string().min(1, "Target is required"),
  type: z.string().optional(),
  protocol: z.string().optional(),
  pii: z.boolean().default(false),
});

export const networkComponentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  component: z.string().optional(),
  type: z.string().optional(),
  port: z.number().optional(),
  protocol: z.string().optional(),
  zone: z.string().optional(),
  topology: z.string().optional(),
  firewallRules: z.string().optional(),
});