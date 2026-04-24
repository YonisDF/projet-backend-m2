import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/config/database.module';
import { AuthModule } from './contexts/auth/auth.module';
import { MessagingModule } from './contexts/chat/messaging.module';
import { PaymentsModule } from './contexts/paiements/payment.module';
import { NotesModule } from './contexts/notes/notes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    MessagingModule,
    PaymentsModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
