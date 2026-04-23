import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('refresh_tokens')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column()
  familyId!: string;

  @Column()
  tokenId!: string;

  @Column()
  tokenHash!: string;

  @Column({ default: false })
  isRevoked!: boolean;

  @Column()
  deviceId!: string;

  @Column({ nullable: true })
  userAgent!: string | null;

  @Column({ nullable: true })
  ipAddress!: string | null;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
