import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT', 3001);
  }

  get anthropicApiKey(): string | undefined {
    return this.configService.get<string>('ANTHROPIC_API_KEY');
  }

  get tableName(): string {
    return this.configService.get<string>('DYNAMODB_TABLE_NAME', 'usetinamou-leads');
  }

  get isLocal(): boolean {
    const isOffline = process.env.IS_OFFLINE || process.env.AWS_SAM_LOCAL || !process.env.AWS_LAMBDA_FUNCTION_NAME;
    return !!isOffline;
  }
}
