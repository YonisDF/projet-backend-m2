import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { NoteRepository } from '../../../app/ports/note.repository.port';
import { NoteEntity } from '../entities/note.entity';

@Injectable()
export class TypeOrmNoteRepository implements NoteRepository {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly repo: Repository<NoteEntity>,
  ) {}

  async create(data: {
    title: string;
    content: string;
    userId: string;
  }): Promise<NoteEntity> {
    const entity = this.repo.create({
      title: data.title,
      content: data.content,
      userId: data.userId,
    });

    return this.repo.save(entity);
  }

  findAllByUserId(userId: string): Promise<NoteEntity[]> {
    return this.repo.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  findByIdAndUserId(id: string, userId: string): Promise<NoteEntity | null> {
    return this.repo.findOne({
      where: { id, userId },
    });
  }

  async updateByIdAndUserId(
    id: string,
    userId: string,
    data: {
      title?: string;
      content?: string;
    },
  ): Promise<NoteEntity | null> {
    const note = await this.repo.findOne({
      where: { id, userId },
    });

    if (!note) {
      return null;
    }

    if (typeof data.title !== 'undefined') {
      note.title = data.title;
    }

    if (typeof data.content !== 'undefined') {
      note.content = data.content;
    }

    return this.repo.save(note);
  }

  async deleteByIdAndUserId(id: string, userId: string): Promise<boolean> {
    const result = await this.repo.delete({ id, userId });
    return (result.affected ?? 0) > 0;
  }
}
