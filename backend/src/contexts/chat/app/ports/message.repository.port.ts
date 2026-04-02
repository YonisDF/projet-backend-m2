import { MessageEntity } from '../../infra/persistence/entities/message.entity';

export interface MessageRepository {
  findById(id: string): Promise<MessageEntity | null>;
  findByConversationId(
    conversationId: string,
    limit?: number,
    before?: Date,
  ): Promise<MessageEntity[]>;
  create(data: {
    conversationId: string;
    senderId: string;
    content: string;
  }): Promise<MessageEntity>;
}
