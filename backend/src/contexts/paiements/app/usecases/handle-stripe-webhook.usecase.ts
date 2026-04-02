/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import Stripe from 'stripe';
import { StripeService } from '../services/stripe.service';
import { PaymentRepository } from '../ports/payment.repository.port';

@Injectable()
export class HandleStripeWebhookUsecase {
  constructor(
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    @Inject('PaymentRepository')
    private readonly payments: PaymentRepository,
  ) {}

  async execute(req: Request & { rawBody?: Buffer }, signature: string) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      throw new BadRequestException('Missing Stripe webhook secret');
    }

    if (!signature) {
      throw new BadRequestException('Missing Stripe signature');
    }

    let event: Stripe.Event;

    try {
      event = this.stripeService.client.webhooks.constructEvent(
        req.rawBody ?? Buffer.from(''),
        signature,
        webhookSecret,
      );
    } catch (error) {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        await this.handleCheckoutSessionCompleted(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;

        await this.payments.updateStatusByProviderSessionId(session.id, {
          status: 'expired',
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;

        if (typeof paymentIntent.id === 'string') {
          await this.handlePaymentIntentFailed(paymentIntent.id);
        }
        break;
      }

      default:
        break;
    }

    return { received: true };
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    const providerPaymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : null;

    if (session.payment_status === 'paid') {
      await this.payments.updateStatusByProviderSessionId(session.id, {
        status: 'paid',
        providerPaymentIntentId,
        paidAt: new Date(),
      });
      return;
    }

    await this.payments.updateStatusByProviderSessionId(session.id, {
      status: 'pending',
      providerPaymentIntentId,
    });
  }

  private async handlePaymentIntentFailed(paymentIntentId: string) {}
}
