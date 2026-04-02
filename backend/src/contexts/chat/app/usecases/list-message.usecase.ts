import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { MessageRepository } from '../ports/message.repository.port';
import { ConversationParticipantRepository } from '../ports/conversation-participant.repository.port';
import { Message } from '../../domain/message';

export interface MessageListQuery {
  conversationId: string;
  userId: string;
  limit?: number;
  before?: Date;
}

export interface MessageListItem {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  editedAt?: Date | null;
  deletedAt?: Date | null;
}

@Injectable()
export class MessageListUsecase {
  constructor(
    @Inject('MessageRepository')
    private readonly messages: MessageRepository,
    @Inject('ConversationParticipantRepository')
    private readonly participants: ConversationParticipantRepository,
  ) {}

  async execute(query: MessageListQuery): Promise<MessageListItem[]> {
    const { conversationId, userId, limit = 50, before } = query;

    const participant = await this.participants.findByConversationAndUser(
      conversationId,
      userId,
    );
    if (!participant) {
      throw new ForbiddenException('Not a participant in this conversation');
    }

    const entities = await this.messages.findByConversationId(
      conversationId,
      limit,
      before,
    );

    const domainMessages = entities
      .map((entity) =>
        Message.rehydrate({
          id: entity.id,
          conversationId: entity.conversationId,
          senderId: entity.senderId,
          content: entity.content,
          createdAt: entity.createdAt,
          editedAt: entity.editedAt,
          deletedAt: entity.deletedAt,
        }),
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return domainMessages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      content: m.content,
      createdAt: m.createdAt,
      editedAt: m.editedAt,
      deletedAt: m.deletedAt,
    }));
  }
}
