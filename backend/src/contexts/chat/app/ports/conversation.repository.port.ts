import { ConversationEntity } from '../../infra/persistence/entities/conversation.entity';

export interface ConversationRepository {
  findById(id: string): Promise<ConversationEntity | null>;
  findAllByUserId(userId: string): Promise<ConversationEntity[]>;
  create(data: { type?: string; title?: string }): Promise<ConversationEntity>;
}
