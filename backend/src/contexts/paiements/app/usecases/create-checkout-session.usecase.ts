import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from '../stripe.service';
import { PaymentRepository } from '../ports/payment.repository.port';

interface CreateCheckoutSessionProps {
  userId: string;
  email: string;
  productName: string;
  amount: number;
  currency?: string;
}

@Injectable()
export class CreateCheckoutSessionUsecase {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    @Inject('PaymentRepository')
    private readonly payments: PaymentRepository,
  ) {}

  async execute(props: CreateCheckoutSessionProps) {
    const currency = props.currency ?? 'eur';

    const session = await this.stripeService.client.checkout.sessions.create({
      mode: 'payment',
      customer_email: props.email,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: props.productName,
            },
            unit_amount: props.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${this.configService.get<string>('STRIPE_SUCCESS_URL')}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: this.configService.get<string>('STRIPE_CANCEL_URL')!,
      metadata: {
        userId: props.userId,
        productName: props.productName,
      },
    });

    const payment = await this.payments.create({
      userId: props.userId,
      amount: props.amount,
      currency,
      status: 'pending',
      provider: 'stripe',
      providerSessionId: session.id,
      providerPaymentIntentId:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null,
      productName: props.productName,
      metadata: {
        userId: props.userId,
        productName: props.productName,
      },
      paidAt: null,
    });

    return {
      paymentId: payment.id,
      sessionId: session.id,
      url: session.url,
    };
  }
}
