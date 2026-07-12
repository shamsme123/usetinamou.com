import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { OrderExtractionSchema } from '../schemas/zod.schemas';
import { z } from 'zod';

type OrderExtractionResult = z.infer<typeof OrderExtractionSchema>;

@Injectable()
export class OrderParserService {
  private readonly logger = new Logger(OrderParserService.name);

  constructor(private ai: AiService) {}

  async parseOrder(message: string, businessType: string): Promise<OrderExtractionResult> {
    this.logger.log(`Parsing order for niche: ${businessType}`);

    const systemInstruction = `You are an order operations assistant. Extract a structured order from the user's messy customer message.
Rules:
- Do not invent or assume values. If a parameter is unknown, set to null.
- Add missingFields labels for standard required details not present in the prompt (e.g. phone, deliveryDate, color, size).
- Keep confirmationMessage concise, polite, professional, and ready to send directly on WhatsApp summarizing their items, listing any missing fields, and asking for their confirmation.
- Output absolute JSON parameters matching the target tool specification.`;

    const promptMessage = `Business type: ${businessType}
Customer message: ${message}`;

    return this.ai.getStructuredOutput(OrderExtractionSchema, promptMessage, systemInstruction);
  }
}
