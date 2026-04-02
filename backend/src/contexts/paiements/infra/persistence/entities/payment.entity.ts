import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('payments')
@Index('IDX_PAYMENTS_USER_ID', ['userId'])
@Index('IDX_PAYMENTS_STATUS', ['status'])
@Index('IDX_PAYMENTS_PROVIDER_SESSION_ID', ['providerSessionId'], {
  unique: true,
})
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'char', length: 36 })
  userId!: string;

  @Column({ type: 'int' })
  amount!: number;

  @Column({ type: 'varchar', length: 10, default: 'eur' })
  currency!: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: string;

  @Column({ type: 'varchar', length: 20, default: 'stripe' })
  provider!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  providerSessionId!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerPaymentIntentId?: string | null;

  @Column({ type: 'varchar', length: 255 })
  productName!: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, string> | null;

  @Column({ type: 'datetime', nullable: true })
  paidAt?: Date | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
