import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { MessageEntity } from './message.entity';
import { ConversationParticipantEntity } from './conversation-participant.entity';

@Entity('conversations')
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, default: 'direct' })
  type: string; // 'direct' | 'group'

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @OneToMany(() => MessageEntity, (message) => message.conversation)
  messages: MessageEntity[];

  @OneToMany(
    () => ConversationParticipantEntity,
    (participant) => participant.conversation,
  )
  participants: ConversationParticipantEntity[];
}
