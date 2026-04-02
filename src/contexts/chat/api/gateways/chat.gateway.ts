/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/contexts/auth/infra/persistence/security/jwt-auth.guard';
import { SendMessageUsecase } from '../../app/usecases/send-message.usecase';
import { ConversationRepository } from '../../app/ports/conversation.repository.port';
import { ConversationParticipantRepository } from '../../app/ports/conversation-participant.repository.port';

interface JoinConversationPayload {
  conversationId: string;
}

interface SendMessagePayload {
  conversationId: string;
  content: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly sendMessageUsecase: SendMessageUsecase,
    private readonly conversations: ConversationRepository,
    private readonly participants: ConversationParticipantRepository,
  ) {}

  handleConnection(client: Socket) {
    this.server.emit('user-joined', 'Yolo' + client.id);
  }

  handleDisconnect(client: Socket) {
    this.server.emit('user-left', 'Yolo' + client.id);
  }

  // Client -> server : join room
  @UseGuards(JwtAuthGuard as any)
  @SubscribeMessage('conversation:join')
  async joinConversation(
    @ConnectedSocket() client: Socket & { user?: any },
    @MessageBody() payload: JoinConversationPayload,
  ) {
    const userId = (client as any).user?.sub;
    if (!userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const conversation = await this.conversations.findById(
      payload.conversationId,
    );
    if (!conversation) {
      client.emit('error', { message: 'Conversation not found' });
      return;
    }

    const participant = await this.participants.findByConversationAndUser(
      payload.conversationId,
      userId,
    );
    if (!participant) {
      client.emit('error', { message: 'Forbidden' });
      return;
    }

    const room = `conversation:${payload.conversationId}`;
    client.join(room);
    client.emit('conversation:joined', {
      conversationId: payload.conversationId,
    });
  }

  // Client -> server : send message
  @UseGuards(JwtAuthGuard as any)
  @SubscribeMessage('message:send')
  async sendMessage(
    @ConnectedSocket() client: Socket & { user?: any },
    @MessageBody() payload: SendMessagePayload,
  ) {
    const userId = (client as any).user?.sub;
    if (!userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const message = await this.sendMessageUsecase.execute({
      conversationId: payload.conversationId,
      senderId: userId,
      content: payload.content,
    });

    const room = `conversation:${payload.conversationId}`;

    this.server.to(room).emit('message:new', {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
    });
  }
}
