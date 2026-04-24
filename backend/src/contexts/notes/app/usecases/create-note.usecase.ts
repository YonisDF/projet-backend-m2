import { Inject, Injectable } from '@nestjs/common';
import type { NoteRepository } from '../ports/note.repository.port';

@Injectable()
export class CreateNoteUsecase {
  constructor(
    @Inject('NoteRepository')
    private readonly notes: NoteRepository,
  ) {}

  async execute(props: { userId: string; title: string; content: string }) {
    return this.notes.create(props);
  }
}
