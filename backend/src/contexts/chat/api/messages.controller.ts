import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/contexts/auth/infra/persistence/security/jwt-auth.guard';
import { SendMessageUsecase } from '../app/usecases/send-message.usecase';
import { MessageListUsecase } from '../app/usecases/list-message.usecase';

class SendMessageDto {
  content!: string;
}

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(
    private readonly sendMessage: SendMessageUsecase,
    private readonly listMessages: MessageListUsecase,
  ) {}

  // POST /messages/:conversationId
  @Post(':conversationId')
  async send(
    @Req() req: any,
    @Param('conversationId') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    const userId = req.user.sub;

    return this.sendMessage.execute({
      conversationId,
      senderId: userId,
      content: dto.content,
    });
  }
}
