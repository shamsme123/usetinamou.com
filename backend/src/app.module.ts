import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './config/config.service';
import { DatabaseService } from './database/database.service';
import { AiService } from './ai/ai.service';
import { OrderParserService } from './services/order-parser.service';
import { CsvFormatterService } from './services/csv-formatter.service';
import { LeadsController } from './controllers/leads.controller';
import { OrderController } from './controllers/order.controller';
import { CsvController } from './controllers/csv.controller';
import { ConfigController } from './controllers/config.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    LeadsController,
    OrderController,
    CsvController,
    ConfigController,
  ],
  providers: [
    AppConfigService,
    DatabaseService,
    AiService,
    OrderParserService,
    CsvFormatterService,
  ],
})
export class AppModule {}
