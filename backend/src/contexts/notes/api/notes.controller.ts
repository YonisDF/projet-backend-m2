import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../auth/infra/persistence/security/jwt-auth.guard';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { NotesService } from '../app/services/notes.service';

type AuthenticatedRequest = Request & {
  user: {
    sub: string;
    email?: string;
  };
};

@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateNoteDto) {
    return this.notesService.create(req.user.sub, dto.title, dto.content);
  }

  @Get()
  list(@Req() req: AuthenticatedRequest) {
    return this.notesService.list(req.user.sub);
  }

  @Get(':id')
  getById(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.notesService.getById(id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, req.user.sub, {
      title: dto.title,
      content: dto.content,
    });
  }

  @Delete(':id')
  delete(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.notesService.delete(id, req.user.sub);
  }
}
