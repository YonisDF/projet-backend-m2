/* eslint-disable @typescript-eslint/unbound-method */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreatePaymentProps,
  PaymentRepository,
  UpdatePaymentStatusProps,
} from '../../../app/ports/payment.repository.port';
import { Payment } from '../../../domain/payment';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentMapper } from '../mappers/payment.mapper';

@Injectable()
export class TypeOrmPaymentRepository implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly repo: Repository<PaymentEntity>,
  ) {}

  async create(data: CreatePaymentProps): Promise<Payment> {
    const entity = this.repo.create({
      userId: data.userId,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      provider: data.provider,
      providerSessionId: data.providerSessionId,
      providerPaymentIntentId: data.providerPaymentIntentId ?? null,
      productName: data.productName,
      metadata: data.metadata ?? null,
      paidAt: data.paidAt ?? null,
    });

    const saved = await this.repo.save(entity);
    return PaymentMapper.toDomain(saved);
  }

  async save(payment: Payment): Promise<Payment> {
    const entity = PaymentMapper.toPersistence(payment);
    const saved = await this.repo.save(entity);
    return PaymentMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Payment | null> {
    const entity = await this.repo.findOne({
      where: { id },
    });

    return entity ? PaymentMapper.toDomain(entity) : null;
  }

  async findByProviderSessionId(
    providerSessionId: string,
  ): Promise<Payment | null> {
    const entity = await this.repo.findOne({
      where: { providerSessionId },
    });

    return entity ? PaymentMapper.toDomain(entity) : null;
  }

  async updateStatusByProviderSessionId(
    providerSessionId: string,
    data: UpdatePaymentStatusProps,
  ): Promise<Payment | null> {
    const entity = await this.repo.findOne({
      where: { providerSessionId },
    });

    if (!entity) {
      return null;
    }

    entity.status = data.status;
    if (data.providerPaymentIntentId !== undefined) {
      entity.providerPaymentIntentId = data.providerPaymentIntentId;
    }
    if (data.paidAt !== undefined) {
      entity.paidAt = data.paidAt;
    }

    const saved = await this.repo.save(entity);
    return PaymentMapper.toDomain(saved);
  }

  async findAllByUserId(userId: string): Promise<Payment[]> {
    const entities = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return entities.map(PaymentMapper.toDomain);
  }
}
