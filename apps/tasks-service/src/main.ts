import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const rabbitMqUrl =
    process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672';
  const queueName = 'tasks_queue';
  const port = process.env.PORT || 3003;

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqUrl],
      queue: queueName,
      queueOptions: { durable: false },
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();
  app.useLogger(app.get(Logger));

  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(
    `📝 Tasks Service escutando na fila: ${queueName}
    e rodando na porta: ${port}`,
  );
}
bootstrap();
