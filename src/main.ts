/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Payments-ms');

  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //para conectar microservice a nats
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers
    }
  }, {
    // para compartir la configuracion de los globals pipes e interceptors, guards y filters en app que no estan basadas en http
    inheritAppConfig: true,
  })

  await app.startAllMicroservices();

  await app.listen(envs.port);

  logger.log(`Payments Microservice running on port ${envs.port}`);
}
bootstrap();
