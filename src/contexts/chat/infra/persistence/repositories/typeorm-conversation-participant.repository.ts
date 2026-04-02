import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationParticipantEntity } from '../entities/conversation-participant.entity';
import { ConversationParticipantRepository } from '../../../app/ports/conversation-participant.repository.port';

@Injectable()
export class TypeOrmConversationParticipantRepository implements ConversationParticipantRepository {
  constructor(
    @InjectRepository(ConversationParticipantEntity)
    private readonly repo: Repository<ConversationParticipantEntity>,
  ) {}

  async addParticipant(data: {
    conversationId: string;
    userId: string;
    role?: string;
  }): Promise<ConversationParticipantEntity> {
    const entity = this.repo.create({
      conversationId: data.conversationId,
      userId: data.userId,
      role: data.role ?? 'member',
    });

    return this.repo.save(entity);
  }

  findAllByConversationId(
    conversationId: string,
  ): Promise<ConversationParticipantEntity[]> {
    return this.repo.find({
      where: { conversationId },
    });
  }

  findByConversationAndUser(
    conversationId: string,
    userId: string,
  ): Promise<ConversationParticipantEntity | null> {
    return this.repo.findOne({
      where: { conversationId, userId },
    });
  }
}
