import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from '../../../app/ports/message.repository.port';

@Injectable()
export class TypeOrmMessageRepository implements MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly repo: Repository<MessageEntity>,
  ) {}

  findById(id: string): Promise<MessageEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['conversation'],
    });
  }

  async findByConversationId(
    conversationId: string,
    limit = 50,
    before?: Date,
  ): Promise<MessageEntity[]> {
    return this.repo.find({
      where: before
        ? {
            conversationId,
            createdAt: LessThan(before),
          }
        : {
            conversationId,
          },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async create(data: {
    conversationId: string;
    senderId: string;
    content: string;
  }): Promise<MessageEntity> {
    const message = this.repo.create({
      conversationId: data.conversationId,
      senderId: data.senderId,
      content: data.content,
    });

    return this.repo.save(message);
  }
}
