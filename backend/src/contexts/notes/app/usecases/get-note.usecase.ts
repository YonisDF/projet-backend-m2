import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { NoteRepository } from '../ports/note.repository.port';

@Injectable()
export class GetNoteUsecase {
  constructor(
    @Inject('NoteRepository')
    private readonly notes: NoteRepository,
  ) {}

  async execute(id: string, userId: string) {
    const note = await this.notes.findByIdAndUserId(id, userId);

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }
}
