import { Injectable } from '@nestjs/common';
import { CreateNoteUsecase } from '../usecases/create-note.usecase';
import { GetNoteUsecase } from '../usecases/get-note.usecase';
import { UpdateNoteUsecase } from '../usecases/update-note.usecase';
import { DeleteNoteUsecase } from '../usecases/delete-note.usecase';
import { ListNotesUsecase } from '../usecases/list-notes.usecase';

@Injectable()
export class NotesService {
  constructor(
    private readonly createNoteUsecase: CreateNoteUsecase,
    private readonly listNotesUsecase: ListNotesUsecase,
    private readonly getNoteUsecase: GetNoteUsecase,
    private readonly updateNoteUsecase: UpdateNoteUsecase,
    private readonly deleteNoteUsecase: DeleteNoteUsecase,
  ) {}

  async create(userId: string, title: string, content: string) {
    return this.createNoteUsecase.execute({ userId, title, content });
  }

  async list(userId: string) {
    return this.listNotesUsecase.execute(userId);
  }

  async getById(id: string, userId: string) {
    return this.getNoteUsecase.execute(id, userId);
  }

  async update(
    id: string,
    userId: string,
    data: {
      title?: string;
      content?: string;
    },
  ) {
    return this.updateNoteUsecase.execute(id, userId, data);
  }

  async delete(id: string, userId: string) {
    return this.deleteNoteUsecase.execute(id, userId);
  }
}
