export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'canceled'
  | 'expired';

export interface PaymentProps {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: 'stripe';
  providerSessionId: string;
  providerPaymentIntentId?: string | null;
  productName: string;
  metadata?: Record<string, string> | null;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date | null;
}

export class Payment {
  private constructor(private readonly props: PaymentProps) {}

  static rehydrate(props: PaymentProps): Payment {
    return new Payment(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get provider(): 'stripe' {
    return this.props.provider;
  }

  get providerSessionId(): string {
    return this.props.providerSessionId;
  }

  get providerPaymentIntentId(): string | null {
    return this.props.providerPaymentIntentId ?? null;
  }

  get productName(): string {
    return this.props.productName;
  }

  get metadata(): Record<string, string> | null {
    return this.props.metadata ?? null;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get paidAt(): Date | null {
    return this.props.paidAt ?? null;
  }

  markAsPaid(paymentIntentId?: string, paidAt: Date = new Date()) {
    this.props.status = 'paid';
    this.props.providerPaymentIntentId = paymentIntentId ?? null;
    this.props.paidAt = paidAt;
  }

  markAsFailed() {
    this.props.status = 'failed';
  }

  markAsCanceled() {
    this.props.status = 'canceled';
  }

  markAsExpired() {
    this.props.status = 'expired';
  }

  toJSON(): PaymentProps {
    return { ...this.props };
  }
}
