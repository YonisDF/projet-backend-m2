import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@Entity('conversation_participants')
@Unique('UQ_CONVERSATION_PARTICIPANT', ['conversationId', 'userId'])
@Index('IDX_CP_CONVERSATION_ID', ['conversationId'])
@Index('IDX_CP_USER_ID', ['userId'])
export class ConversationParticipantEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'char', length: 36 })
  conversationId!: string;

  @Column({ type: 'char', length: 36 })
  userId!: string;

  @Column({ type: 'varchar', length: 20, default: 'member' })
  role!: string;

  @Column({ type: 'char', length: 36, nullable: true })
  lastReadMessageId?: string;

  @CreateDateColumn({ type: 'datetime' })
  joinedAt!: Date;

  @ManyToOne(
    () => ConversationEntity,
    (conversation) => conversation.participants,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'conversationId' })
  conversation!: ConversationEntity;
}
