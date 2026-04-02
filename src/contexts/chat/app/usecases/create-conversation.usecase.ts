import { Inject, Injectable } from '@nestjs/common';
import { ConversationRepository } from '../ports/conversation.repository.port';
import { ConversationParticipantRepository } from '../ports/conversation-participant.repository.port';

interface CreateConversationProps {
  creatorId: string;
  participantIds: string[]; // no creator
  type?: 'direct' | 'group';
  title?: string;
}

@Injectable()
export class CreateConversationUsecase {
  constructor(
    @Inject('ConversationRepository')
    private readonly conversations: ConversationRepository,

    @Inject('ConversationParticipantRepository')
    private readonly participants: ConversationParticipantRepository,
  ) {}

  async execute(props: CreateConversationProps) {
    const { creatorId, participantIds, type, title } = props;

    // Create conversation
    const conversation = await this.conversations.create({
      type: type ?? (participantIds.length > 1 ? 'group' : 'direct'),
      title,
    });

    // Add creator as owner
    await this.participants.addParticipant({
      conversationId: conversation.id,
      userId: creatorId,
      role: 'owner',
    });

    // Add other participants
    const uniqueOthers = Array.from(
      new Set(participantIds.filter((id) => id !== creatorId)),
    );

    for (const userId of uniqueOthers) {
      await this.participants.addParticipant({
        conversationId: conversation.id,
        userId,
        role: 'member',
      });
    }

    // Reload conversation
    const full = await this.conversations.findById(conversation.id);
    return full ?? conversation;
  }
}
