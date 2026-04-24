import type { NoteEntity } from '../../infra/persistence/entities/note.entity';

export interface NoteRepository {
  create(data: {
    title: string;
    content: string;
    userId: string;
  }): Promise<NoteEntity>;

  findAllByUserId(userId: string): Promise<NoteEntity[]>;

  findByIdAndUserId(id: string, userId: string): Promise<NoteEntity | null>;

  updateByIdAndUserId(
    id: string,
    userId: string,
    data: {
      title?: string;
      content?: string;
    },
  ): Promise<NoteEntity | null>;

  deleteByIdAndUserId(id: string, userId: string): Promise<boolean>;
}
