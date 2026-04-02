import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@Entity('messages')
@Index('IDX_MESSAGES_CONVERSATION_ID', ['conversationId'])
@Index('IDX_MESSAGES_SENDER_ID', ['senderId'])
@Index('IDX_MESSAGES_CREATED_AT', ['createdAt'])
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 36 })
  conversationId: string;

  @Column({ type: 'char', length: 36 })
  senderId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'datetime', nullable: true })
  editedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  deletedAt?: Date;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @ManyToOne(
    () => ConversationEntity,
    (conversation) => conversation.messages,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'conversationId' })
  conversation: ConversationEntity;
}
