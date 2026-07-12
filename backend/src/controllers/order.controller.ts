import { Controller, Post, Body, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { OrderParserService } from '../services/order-parser.service';

@Controller('generate/order')
export class OrderController {
  constructor(
    private db: DatabaseService,
    private parser: OrderParserService
  ) {}

  @Post()
  async parseCustomerOrder(
    @Body() body: { email: string; orderText: string; businessType: string }
  ) {
    const { email, orderText, businessType } = body;
    if (!email || !orderText || !businessType) {
      throw new BadRequestException('Required input arguments missing: email, orderText, and businessType.');
    }

    // Input payload limits check
    if (orderText.length > 2000) {
      throw new BadRequestException('Input order text exceeds maximum allowance of 2000 characters.');
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
      const extractionResult = await this.parser.parseOrder(orderText, businessType);
      return {
        success: true,
        generationsRemaining: user.credits,
        data: extractionResult,
      };
    } catch (err: unknown) {
      // Refund credit if extraction completely fails
      user.credits += 1;
      await this.db.saveUser(user);
      throw new BadRequestException(err instanceof Error ? err.message : String(err));
    }
  }
}
