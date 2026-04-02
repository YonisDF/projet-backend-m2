import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEntity } from '../entities/conversation.entity';
import { ConversationRepository } from '../../../app/ports/conversation.repository.port';

@Injectable()
export class TypeOrmConversationRepository implements ConversationRepository {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly repo: Repository<ConversationEntity>,
  ) {}

  findById(id: string): Promise<ConversationEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['messages'],
    });
  }

  async findAllByUserId(userId: string): Promise<ConversationEntity[]> {
    return this.repo
      .createQueryBuilder('conversation')
      .innerJoinAndSelect(
        'conversation.participants',
        'participant',
        'participant.userId = :userId',
        { userId },
      )
      .leftJoinAndSelect('conversation.messages', 'message')
      .orderBy('conversation.updatedAt', 'DESC')
      .getMany();
  }

  async create(data: {
    type?: string;
    title?: string;
  }): Promise<ConversationEntity> {
    const conversation = this.repo.create({
      type: data.type ?? 'direct',
      title: data.title,
    });

    return this.repo.save(conversation);
  }
}
