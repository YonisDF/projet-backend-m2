import { Payment } from '../../../domain/payment';
import { PaymentEntity } from '../entities/payment.entity';

export class PaymentMapper {
  static toDomain(entity: PaymentEntity): Payment {
    return Payment.rehydrate({
      id: entity.id,
      userId: entity.userId,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status as
        | 'pending'
        | 'paid'
        | 'failed'
        | 'canceled'
        | 'expired',
      provider: entity.provider as 'stripe',
      providerSessionId: entity.providerSessionId,
      providerPaymentIntentId: entity.providerPaymentIntentId ?? null,
      productName: entity.productName,
      metadata: entity.metadata ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      paidAt: entity.paidAt ?? null,
    });
  }

  static toPersistence(payment: Payment): PaymentEntity {
    const raw = payment.toJSON();

    const entity = new PaymentEntity();
    entity.id = raw.id;
    entity.userId = raw.userId;
    entity.amount = raw.amount;
    entity.currency = raw.currency;
    entity.status = raw.status;
    entity.provider = raw.provider;
    entity.providerSessionId = raw.providerSessionId;
    entity.providerPaymentIntentId = raw.providerPaymentIntentId ?? null;
    entity.productName = raw.productName;
    entity.metadata = raw.metadata ?? null;
    entity.createdAt = raw.createdAt;
    entity.updatedAt = raw.updatedAt;
    entity.paidAt = raw.paidAt ?? null;

    return entity;
  }
}
