import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { MessageRepository } from '../ports/message.repository.port';
import { ConversationParticipantRepository } from '../ports/conversation-participant.repository.port';

interface SendMessageProps {
  conversationId: string;
  senderId: string;
  content: string;
}

@Injectable()
export class SendMessageUsecase {
  constructor(
    @Inject('MessageRepository')
    private readonly messages: MessageRepository,
    @Inject('ConversationParticipantRepository')
    private readonly participants: ConversationParticipantRepository,
  ) {}

  async execute(props: SendMessageProps) {
    const { conversationId, senderId, content } = props;

    const participant = await this.participants.findByConversationAndUser(
      conversationId,
      senderId,
    );
    if (!participant) {
      throw new ForbiddenException('Not a participant in this conversation');
    }

    const message = await this.messages.create({
      conversationId,
      senderId,
      content,
    });

    return message;
  }
}
