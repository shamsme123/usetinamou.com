import { Controller, Get } from '@nestjs/common';

@Controller('config')
export class ConfigController {
  @Get()
  getConfig() {
    return {
      freeGenerationLimit: 15,
      freeRowLimit: 20,
      features: {
        orderParser: true,
        productCsv: true,
      },
    };
  }
}
