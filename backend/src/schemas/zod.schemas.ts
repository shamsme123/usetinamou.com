import { z } from 'zod';

export const OrderItemSchema = z.object({
  item: z.string().describe('The name or description of the product or item ordered'),
  quantity: z.number().nullable().describe('The count or quantity of items ordered. Set to null if missing or not specified.'),
  size: z.string().nullable().describe('Size details if specified (e.g. XL, M, 10 inch). Null if not present.'),
  color: z.string().nullable().describe('Color details if specified (e.g. Red, Blue). Null if not present.'),
  notes: z.string().nullable().describe('Any custom personalization notes, names, or messages to be printed/engraved. Null if not present.')
});

export const OrderExtractionSchema = z.object({
  customerName: z.string().nullable().describe('The name of the customer placing the order. Null if unknown.'),
  phone: z.string().nullable().describe('The customer phone number if present. Null if missing.'),
  email: z.string().nullable().describe('The customer email address if present. Null if missing.'),
  billingName: z.string().nullable().describe('Company or person name to bill/invoice to. Null if not present.'),
  shippingAddress: z.string().nullable().describe('Deliver or shipping location details. Null if not present.'),
  deliveryDate: z.string().nullable().describe('Target delivery or completion date. Keep relative value or specify exact date if given. Null if not present.'),
  items: z.array(OrderItemSchema).describe('List of individual items extracted from the order message.'),
  missingFields: z.array(z.string()).describe('List of names of standard required fields that are missing from the message (e.g. phone, deliveryDate, color, size).'),
  confidenceScore: z.number().describe('Confidence estimation score between 0.0 and 1.0 for the extraction accuracy.'),
  confirmationMessage: z.string().describe('A polite, ready-to-send confirmation draft to send back to the customer on WhatsApp summarizing their items, and asking for missing fields.')
});

export const ProductCsvSchema = z.object({
  mappedColumns: z.array(z.string()).describe('The clean canonical output column headers. Must include: title, sku, price, compare_at_price, quantity, size, color, description, tags, seo_title, seo_description'),
  cleanedRows: z.array(z.record(z.string(), z.string())).describe('Array of rows where each key corresponds to mappedColumns. Empty columns should have empty string value.'),
  warnings: z.array(z.string()).describe('Validations warnings e.g. "Row 3: SKU is missing", "Row 5: Price is invalid", "Row 2: Title is duplicate"'),
  duplicateCandidates: z.array(z.string()).describe('List of items/SKUs/titles that appear to be duplicate listings in the uploaded set.'),
  missingRequiredFields: z.array(z.string()).describe('List of columns that should have values but are entirely empty across rows (e.g. sku, price)')
});
