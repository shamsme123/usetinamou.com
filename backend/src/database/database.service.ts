import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import * as fs from 'fs';
import * as path from 'path';

export interface UserRecord {
  email: string;
  name: string;
  useCase: string;
  credits: number;
  createdAt: string;
  lastSeenAt: string;
}

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  private dynamoDocClient: DynamoDBDocumentClient | null = null;
  private readonly mockFilePath = path.join(process.cwd(), 'database_mock.json');

  constructor(private config: AppConfigService) {
    if (!this.config.isLocal) {
      this.logger.log('Initializing AWS DynamoDB Client...');
      const client = new DynamoDBClient({});
      this.dynamoDocClient = DynamoDBDocumentClient.from(client);
    } else {
      this.logger.log(`Running in Local Mode. Persistence file: ${this.mockFilePath}`);
      if (!fs.existsSync(this.mockFilePath)) {
        fs.writeFileSync(this.mockFilePath, JSON.stringify({}), 'utf-8');
      }
    }
  }

  // Privacy-first log: redact any values that look like customer order lists or PII
  private logQuery(action: string, email: string) {
    this.logger.log(`Database [${action}] query executed for user: ${email.replace(/(..)(.*)(@.*)/, '$1***$3')}`);
  }

  async getUser(email: string): Promise<UserRecord | null> {
    const key = email.toLowerCase().trim();
    this.logQuery('GET', key);

    if (this.dynamoDocClient) {
      try {
        const response = await this.dynamoDocClient.send(
          new GetCommand({
            TableName: this.config.tableName,
            Key: { email: key },
          })
        );
        return (response.Item as UserRecord) ?? null;
      } catch (err: unknown) {
        this.logger.error(`DynamoDB Get Error: ${err instanceof Error ? err.message : String(err)}`);
        return null;
      }
    } else {
      // Local JSON File Mode
      try {
        const raw = fs.readFileSync(this.mockFilePath, 'utf-8');
        const db = JSON.parse(raw);
        return db[key] ?? null;
      } catch {
        return null;
      }
    }
  }

  async saveUser(user: UserRecord): Promise<void> {
    const key = user.email.toLowerCase().trim();
    this.logQuery('SAVE', key);

    // Filter properties to guarantee data privacy (ensure NO raw inputs/CSVs get stored)
    const sanitizedRecord: UserRecord = {
      email: key,
      name: user.name,
      useCase: user.useCase,
      credits: user.credits,
      createdAt: user.createdAt,
      lastSeenAt: user.lastSeenAt,
    };

    if (this.dynamoDocClient) {
      try {
        await this.dynamoDocClient.send(
          new PutCommand({
            TableName: this.config.tableName,
            Item: sanitizedRecord,
          })
        );
      } catch (err: unknown) {
        this.logger.error(`DynamoDB Put Error: ${err instanceof Error ? err.message : String(err)}`);
        throw new Error('Database insertion failed');
      }
    } else {
      // Local JSON File Mode
      try {
        const raw = fs.readFileSync(this.mockFilePath, 'utf-8');
        const db = JSON.parse(raw);
        db[key] = sanitizedRecord;
        fs.writeFileSync(this.mockFilePath, JSON.stringify(db, null, 2), 'utf-8');
      } catch (err: unknown) {
        this.logger.error(`Local write error: ${err instanceof Error ? err.message : String(err)}`);
        throw new Error('Local database write failed');
      }
    }
  }
}
