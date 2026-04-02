import {
  Body,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/contexts/auth/infra/persistence/security/jwt-auth.guard';
import { CreateCheckoutSessionUsecase } from '../app/usecases/create-checkout-session.usecase';
import { HandleStripeWebhookUsecase } from '../app/usecases/handle-stripe-webhook.usecase';
import { CreateCheckoutSessionDto } from './dtos/create-checkout-session.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly createCheckoutSession: CreateCheckoutSessionUsecase,
    private readonly handleStripeWebhook: HandleStripeWebhookUsecase,
  ) {}

  @Post('checkout-session')
  @UseGuards(JwtAuthGuard)
  async createSession(@Req() req: any, @Body() dto: CreateCheckoutSessionDto) {
    return this.createCheckoutSession.execute({
      userId: req.user.sub,
      email: req.user.email ?? 'dev@example.com',
      productName: dto.productName,
      amount: dto.amount,
      currency: dto.currency,
    });
  }

  @Post('webhook')
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.handleStripeWebhook.execute(req, signature);
  }
}
