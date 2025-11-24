import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AllExceptionsFilter, RRpcValidationFilter } from '@app/common';
import { Transport } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const rabbitMqUrl =
    process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672';
  const queueName = 'gateway_queue';
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: queueName,
      queueOptions: { durable: true },
    },
  });

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();
  await app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API Gateway para o Sistema de Gestão de Tarefas')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useLogger(app.get(Logger));
  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter),
    new RRpcValidationFilter(),
  );
  const port = process.env.PORT || 3001;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`🚀 Gateway rodando na porta: ${port}`);
}
bootstrap();
