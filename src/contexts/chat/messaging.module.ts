import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './infra/persistence/entities/conversation.entity';
import { TypeOrmConversationRepository } from './infra/persistence/repositories/typeorm-conversation.repository';
import { MessageEntity } from './infra/persistence/entities/message.entity';
import { TypeOrmMessageRepository } from './infra/persistence/repositories/typeorm-message.repository';
import { ConversationParticipantEntity } from './infra/persistence/entities/conversation-participant.entity';
import { TypeOrmConversationParticipantRepository } from './infra/persistence/repositories/typeorm-conversation-participant.repository';
import { ChatGateway } from './api/gateways/chat.gateway';
import { SendMessageUsecase } from './app/usecases/send-message.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConversationEntity,
      MessageEntity,
      ConversationParticipantEntity,
    ]),
  ],
  providers: [
    TypeOrmConversationRepository,
    TypeOrmMessageRepository,
    TypeOrmConversationParticipantRepository,
    ChatGateway,
    SendMessageUsecase,
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
