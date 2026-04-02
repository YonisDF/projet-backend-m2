import { Inject, Injectable } from '@nestjs/common';
import { ConversationRepository } from '../ports/conversation.repository.port';
import { MessageRepository } from '../ports/message.repository.port';
import { Conversation } from '../../domain/conversation';

export interface ConversationListItem {
  id: string;
  type: string;
  title: string | null;
  lastMessage?: {
    id: string;
    senderId: string;
    content: string;
    createdAt: Date;
  };
  updatedAt: Date;
}

@Injectable()
export class ConversationListUsecase {
  constructor(
    @Inject('ConversationRepository')
    private readonly conversations: ConversationRepository,
    @Inject('MessageRepository')
    private readonly messages: MessageRepository,
  ) {}

  async execute(userId: string): Promise<ConversationListItem[]> {
    const convos = await this.conversations.findAllByUserId(userId);

    const result: ConversationListItem[] = [];

    for (const convoEntity of convos) {
      const convo = Conversation.rehydrate({
        id: convoEntity.id,
        type: convoEntity.type as any,
        title: convoEntity.title,
        createdAt: convoEntity.createdAt,
        updatedAt: convoEntity.updatedAt,
      });

      const messages = await this.messages.findByConversationId(convo.id, 1);

      const last = messages[0];

      result.push({
        id: convo.id,
        type: convo.type,
        title: convo.title,
        updatedAt: convo.updatedAt,
        ...(last && {
          lastMessage: {
            id: last.id,
            senderId: last.senderId,
            content: last.content,
            createdAt: last.createdAt,
          },
        }),
      });
    }

    // Sort to get the correct order
    return result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
}
