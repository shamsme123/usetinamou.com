import { Controller, Post, Body, BadRequestException, HttpStatus } from '@nestjs/common';
import { DatabaseService, UserRecord } from '../database/database.service';

@Controller('leads')
export class LeadsController {
  constructor(private db: DatabaseService) {}

  @Post()
  async registerLead(
    @Body() body: { name: string; email: string; useCase: string; consentAccepted?: boolean }
  ) {
    const { name, email, useCase } = body;
    if (!name || !email || !useCase) {
      throw new BadRequestException('Required fields missing: name, email, and useCase must be specified.');
    }

    const trimmedEmail = email.toLowerCase().trim();
    let user = await this.db.getUser(trimmedEmail);

    if (!user) {
      user = {
        email: trimmedEmail,
        name: name.trim(),
        useCase: useCase.trim(),
        credits: 15, // Sandbox quota allocation
        createdAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
      };
      await this.db.saveUser(user);
    } else {
      user.lastSeenAt = new Date().toISOString();
      await this.db.saveUser(user);
    }

    return {
      statusCode: HttpStatus.CREATED,
      leadId: Buffer.from(trimmedEmail).toString('base64'),
      generationsRemaining: user.credits,
    };
  }
}
