import { Controller, Post, Body, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CsvFormatterService } from '../services/csv-formatter.service';

@Controller('generate/product-csv')
export class CsvController {
  constructor(
    private db: DatabaseService,
    private formatter: CsvFormatterService
  ) {}

  @Post()
  async formatCatalogCsv(
    @Body() body: {
      email: string;
      columns: string[];
      rows: Record<string, string>[];
      targetSchema: string;
      category?: string;
    }
  ) {
    const { email, columns, rows, targetSchema, category } = body;
    if (!email || !columns || !rows || !targetSchema) {
      throw new BadRequestException('Required input arguments missing: email, columns, rows, or targetSchema.');
    }

    // Sandbox row inputs limits check
    if (rows.length > 20) {
      throw new BadRequestException('Sandbox processing is limited to 20 rows per catalog upload.');
    }

    const trimmedEmail = email.toLowerCase().trim();
    const user = await this.db.getUser(trimmedEmail);
    if (!user) {
      throw new NotFoundException(`User record associated with ${trimmedEmail} was not found. Please register first.`);
    }

    if (user.credits <= 0) {
      throw new ForbiddenException('Sandbox Quota Reached. Please extend your sandbox credit limits.');
    }

    // Deduct 1 credit
    user.credits -= 1;
    user.lastSeenAt = new Date().toISOString();
    await this.db.saveUser(user);

    try {
      const formatResult = await this.formatter.formatCsv(columns, rows, targetSchema, category);
      return {
        success: true,
        generationsRemaining: user.credits,
        data: formatResult,
      };
    } catch (err: unknown) {
      // Refund credit if formatting completely fails
      user.credits += 1;
      await this.db.saveUser(user);
      throw new BadRequestException(err instanceof Error ? err.message : String(err));
    }
  }
}
