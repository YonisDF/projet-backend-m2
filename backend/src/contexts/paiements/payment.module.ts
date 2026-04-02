import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './app/services/stripe.service';
import { CreateCheckoutSessionUsecase } from './app/usecases/create-checkout-session.usecase';
import { HandleStripeWebhookUsecase } from './app/usecases/handle-stripe-webhook.usecase';
import { AuthModule } from '../auth/auth.module';
import { PaymentsController } from './api/payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './infra/persistence/entities/payment.entity';
import { TypeOrmPaymentRepository } from './infra/persistence/repositories/typeorm-payment.repository';
import { PaymentsService } from './app/services/payment.service';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([PaymentEntity]),
  ],
  controllers: [PaymentsController],
  providers: [
    StripeService,
    PaymentsService,
    CreateCheckoutSessionUsecase,
    HandleStripeWebhookUsecase,
    TypeOrmPaymentRepository,
    {
      provide: 'PaymentRepository',
      useClass: TypeOrmPaymentRepository,
    },
  ],
  exports: [StripeService, 'PaymentRepository'],
})
export class PaymentsModule {}
