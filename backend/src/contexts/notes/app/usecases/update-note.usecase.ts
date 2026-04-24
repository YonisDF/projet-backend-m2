import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { NoteRepository } from '../ports/note.repository.port';

@Injectable()
export class UpdateNoteUsecase {
  constructor(
    @Inject('NoteRepository')
    private readonly notes: NoteRepository,
  ) {}

  async execute(
    id: string,
    userId: string,
    data: {
      title?: string;
      content?: string;
    },
  ) {
    const updated = await this.notes.updateByIdAndUserId(id, userId, data);

    if (!updated) {
      throw new NotFoundException('Note not found');
    }

    return updated;
  }
}
