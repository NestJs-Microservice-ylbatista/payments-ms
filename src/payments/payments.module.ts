/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [NatsModule] //importo el modulo de nats para luego inyectar el cliente en payments.service.ts
})
export class PaymentsModule {}
