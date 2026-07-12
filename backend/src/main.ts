import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS so the React frontend can query the API
  app.enableCors();
  
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

// AWS Lambda handler export
export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};

// Local standalone Express server fallback
if (!process.env.AWS_LAMBDA_FUNCTION_NAME && !process.env.IS_OFFLINE) {
  async function startLocal() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`Server successfully started locally on http://localhost:${port}`);
  }
  startLocal();
}
