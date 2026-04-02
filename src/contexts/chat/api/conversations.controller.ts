import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/contexts/auth/infra/persistence/security/jwt-auth.guard';
import { CreateConversationUsecase } from '../app/usecases/create-conversation.usecase';
import { CreateConversationDto } from './dtos/create-conversation.dto';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly createConversation: CreateConversationUsecase) {}

  @Post()
  async create(@Body() dto: CreateConversationDto, req: any) {
    const userId = req.user.sub;

    return this.createConversation.execute({
      creatorId: userId,
      participantIds: dto.participantIds,
      type: dto.type,
      title: dto.title,
    });
  }
}
