import { ConversationParticipantEntity } from '../../infra/persistence/entities/conversation-participant.entity';

export interface ConversationParticipantRepository {
  addParticipant(data: {
    conversationId: string;
    userId: string;
    role?: string;
  }): Promise<ConversationParticipantEntity>;

  findAllByConversationId(
    conversationId: string,
  ): Promise<ConversationParticipantEntity[]>;

  findByConversationAndUser(
    conversationId: string,
    userId: string,
  ): Promise<ConversationParticipantEntity | null>;
}
