import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './shared/env/envs';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('main');

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // origin: ['http://localhost:3001'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(envs.PORT);
  logger.log(`Application listening on port ${envs.PORT}`);
}
bootstrap();
