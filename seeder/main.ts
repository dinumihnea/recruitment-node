import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule, {
    logger: false,
  });
  await app.close();
}
bootstrap();
