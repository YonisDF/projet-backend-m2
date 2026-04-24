import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { NoteRepository } from '../ports/note.repository.port';

@Injectable()
export class DeleteNoteUsecase {
  constructor(
    @Inject('NoteRepository')
    private readonly notes: NoteRepository,
  ) {}

  async execute(id: string, userId: string) {
    const deleted = await this.notes.deleteByIdAndUserId(id, userId);

    if (!deleted) {
      throw new NotFoundException('Note not found');
    }

    return {
      success: true,
    };
  }
}
