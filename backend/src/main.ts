import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionResponseFilter } from './exception-filters/res-type.exception-fillter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ExceptionResponseFilter());
  app.enableCors({
    origin: new RegExp(process.env.ALLOWED_ORIGIN),
  });
  await app.listen(process.env.PORT);
}
bootstrap();
