import { Payment } from '../../domain/payment';

export interface CreatePaymentProps {
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'canceled' | 'expired';
  provider: 'stripe';
  providerSessionId: string;
  providerPaymentIntentId?: string | null;
  productName: string;
  metadata?: Record<string, string> | null;
  paidAt?: Date | null;
}

export interface UpdatePaymentStatusProps {
  status: 'pending' | 'paid' | 'failed' | 'canceled' | 'expired';
  providerPaymentIntentId?: string | null;
  paidAt?: Date | null;
}

export interface PaymentRepository {
  create(data: CreatePaymentProps): Promise<Payment>;
  save(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByProviderSessionId(providerSessionId: string): Promise<Payment | null>;
  updateStatusByProviderSessionId(
    providerSessionId: string,
    data: UpdatePaymentStatusProps,
  ): Promise<Payment | null>;
  findAllByUserId(userId: string): Promise<Payment[]>;
}
