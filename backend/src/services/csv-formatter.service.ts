import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { ProductCsvSchema } from '../schemas/zod.schemas';
import { z } from 'zod';

type ProductCsvResult = z.infer<typeof ProductCsvSchema>;

@Injectable()
export class CsvFormatterService {
  private readonly logger = new Logger(CsvFormatterService.name);

  constructor(private ai: AiService) {}

  async formatCsv(
    columns: string[],
    rows: Record<string, string>[],
    targetSchema: string,
    category?: string
  ): Promise<ProductCsvResult> {
    this.logger.log(`Formatting product CSV targeting: ${targetSchema}`);

    const systemInstruction = `You are a product listing data engineer. Standardize messy supplier tables and pasted rows into a clean, normalized structure mapping strictly to the target schema (${targetSchema}).
Rules:
- Standardize titles (proper capitalization), normalize pricing fields (extract number values), correct variant size/color mappings.
- Output columns MUST match exactly the mappedColumns schema definition: [title, sku, price, compare_at_price, quantity, size, color, description, tags, seo_title, seo_description]
- Perform duplicate checks: Identify any titles or SKUs in cleanedRows that appear to be duplicate candidates and list them.
- If there are missing fields or schema integrity issues, list them under warnings or missingRequiredFields.`;

    const promptMessage = `Target Schema: ${targetSchema}
Niche/Category context: ${category || 'General Merchandise'}
Original Column Headers: ${JSON.stringify(columns)}
Original Row Entries: ${JSON.stringify(rows)}`;

    return this.ai.getStructuredOutput(ProductCsvSchema, promptMessage, systemInstruction);
  }
}
