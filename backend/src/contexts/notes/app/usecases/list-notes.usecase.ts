import { Inject, Injectable } from '@nestjs/common';
import type { NoteRepository } from '../ports/note.repository.port';

@Injectable()
export class ListNotesUsecase {
  constructor(
    @Inject('NoteRepository')
    private readonly notes: NoteRepository,
  ) {}

  async execute(userId: string) {
    return this.notes.findAllByUserId(userId);
  }
}
