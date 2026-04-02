/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/contexts/auth/infra/persistence/security/jwt-auth.guard';
import { CreateConversationUsecase } from '../app/usecases/create-conversation.usecase';
import { ConversationListUsecase } from '../app/usecases/list-conversation.usecase';
import { MessageListUsecase } from '../app/usecases/list-message.usecase';
import { CreateConversationDto } from './dtos/create-conversation.dto';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(
    private readonly createConversation: CreateConversationUsecase,
    private readonly listConversations: ConversationListUsecase,
    private readonly listMessages: MessageListUsecase,
  ) {}

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.listConversations.execute(userId);
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateConversationDto) {
    const userId = req.user.sub;

    return this.createConversation.execute({
      creatorId: userId,
      title: dto.title,
      participantIds: dto.participantIds ?? [userId],
      type: 'direct',
    });
  }

  @Get(':id/messages')
  getMessages(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;

    return this.listMessages.execute({
      conversationId: id,
      userId,
    });
  }
}
