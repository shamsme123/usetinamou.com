import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import { ChatAnthropic } from '@langchain/anthropic';
import { z } from 'zod';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private model: ChatAnthropic | null = null;

  constructor(private config: AppConfigService) {
    const key = this.config.anthropicApiKey;
    if (key) {
      this.model = new ChatAnthropic({
        apiKey: key,
        modelName: 'claude-3-5-haiku-20241022',
        temperature: 0,
      });
    } else {
      this.logger.warn('WARNING: ANTHROPIC_API_KEY is not defined. AI generations will fail.');
    }
  }

  async getStructuredOutput<T extends z.ZodTypeAny>(
    zodSchema: T,
    promptMessage: string,
    systemInstruction?: string,
  ): Promise<z.infer<T>> {
    if (!this.model) {
      throw new Error('Anthropic API key is not configured on the backend. Please add ANTHROPIC_API_KEY to your backend/.env file.');
    }

    try {
      this.logger.log('Executing ChatAnthropic model tool calling run...');
      
      // Typecast to any to prevent TS2589 (excessively deep type instantiation) compiler issues
      const structuredModel = (this.model as any).withStructuredOutput(zodSchema);
      
      const messages: [string, string][] = [];
      if (systemInstruction) {
        messages.push(['system', systemInstruction]);
      }
      messages.push(['human', promptMessage]);

      const response = await structuredModel.invoke(messages);
      return response;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`AI structured run failed: ${errMsg}`);
      throw new Error(`AI generation error: ${errMsg}`);
    }
  }
}
