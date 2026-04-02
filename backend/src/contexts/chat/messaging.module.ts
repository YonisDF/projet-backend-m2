import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/contexts/auth/auth.module';
import { ConversationEntity } from './infra/persistence/entities/conversation.entity';
import { MessageEntity } from './infra/persistence/entities/message.entity';
import { ConversationParticipantEntity } from './infra/persistence/entities/conversation-participant.entity';
import { TypeOrmConversationRepository } from './infra/persistence/repositories/typeorm-conversation.repository';
import { TypeOrmMessageRepository } from './infra/persistence/repositories/typeorm-message.repository';
import { TypeOrmConversationParticipantRepository } from './infra/persistence/repositories/typeorm-conversation-participant.repository';
import { ChatGateway } from './api/gateways/chat.gateway';
import { ConversationsController } from './api/conversations.controller';
import { SendMessageUsecase } from './app/usecases/send-message.usecase';
import { ConversationListUsecase } from './app/usecases/list-conversation.usecase';
import { MessageListUsecase } from './app/usecases/list-message.usecase';
import { CreateConversationUsecase } from './app/usecases/create-conversation.usecase';

@Module({
  imports: [
    AuthModule, // <-- pour avoir JwtTokenService
    TypeOrmModule.forFeature([
      ConversationEntity,
      MessageEntity,
      ConversationParticipantEntity,
    ]),
  ],
  controllers: [ConversationsController],
  providers: [
    TypeOrmConversationRepository,
    TypeOrmMessageRepository,
    TypeOrmConversationParticipantRepository,
    ChatGateway,
    SendMessageUsecase,
    ConversationListUsecase,
    MessageListUsecase,
    CreateConversationUsecase,
    {
      provide: 'ConversationRepository',
      useClass: TypeOrmConversationRepository,
    },
    {
      provide: 'MessageRepository',
      useClass: TypeOrmMessageRepository,
    },
    {
      provide: 'ConversationParticipantRepository',
      useClass: TypeOrmConversationParticipantRepository,
    },
  ],
  exports: [
    'ConversationRepository',
    'MessageRepository',
    'ConversationParticipantRepository',
  ],
})
export class MessagingModule {}
