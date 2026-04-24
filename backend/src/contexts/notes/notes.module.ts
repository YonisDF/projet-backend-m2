import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteEntity } from './infra/persistence/entities/note.entity';
import { TypeOrmNoteRepository } from './infra/persistence/repositories/typeorm-note.repository';
import { NotesService } from './app/services/notes.service';
import { CreateNoteUsecase } from './app/usecases/create-note.usecase';
import { ListNotesUsecase } from './app/usecases/list-notes.usecase';
import { GetNoteUsecase } from './app/usecases/get-note.usecase';
import { UpdateNoteUsecase } from './app/usecases/update-note.usecase';
import { DeleteNoteUsecase } from './app/usecases/delete-note.usecase';
import { AuthModule } from '../auth/auth.module';
import { NotesController } from './api/notes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NoteEntity]), AuthModule],
  controllers: [NotesController],
  providers: [
    NotesService,
    CreateNoteUsecase,
    ListNotesUsecase,
    GetNoteUsecase,
    UpdateNoteUsecase,
    DeleteNoteUsecase,
    TypeOrmNoteRepository,
    {
      provide: 'NoteRepository',
      useClass: TypeOrmNoteRepository,
    },
  ],
  exports: [NotesService],
})
export class NotesModule {}
