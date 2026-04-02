/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
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
  server!: Server;

  constructor(
    private readonly sendMessageUsecase: SendMessageUsecase,

    @Inject('ConversationRepository')
    private readonly conversations: ConversationRepository,

    @Inject('ConversationParticipantRepository')
    private readonly participants: ConversationParticipantRepository,
  ) {}

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('conversation:join')
  async joinConversation(
    @ConnectedSocket() client: Socket & { user?: any },
    @MessageBody() payload: JoinConversationPayload,
  ) {
    const userId = client.data?.user?.sub ?? client.handshake.auth?.userId;
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

    client.join(`conversation:${payload.conversationId}`);
    client.emit('conversation:joined', {
      conversationId: payload.conversationId,
    });
  }

  @SubscribeMessage('message:send')
  async sendMessage(
    @ConnectedSocket() client: Socket & { user?: any },
    @MessageBody() payload: SendMessagePayload,
  ) {
    const userId = client.data?.user?.sub ?? client.handshake.auth?.userId;
    if (!userId) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    const message = await this.sendMessageUsecase.execute({
      conversationId: payload.conversationId,
      senderId: userId,
      content: payload.content,
    });

    this.server
      .to(`conversation:${payload.conversationId}`)
      .emit('message:new', {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        content: message.content,
        createdAt: message.createdAt,
      });
  }
}
