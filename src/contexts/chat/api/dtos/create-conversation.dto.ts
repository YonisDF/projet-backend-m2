export class CreateConversationDto {
  participantIds: string[];
  type?: 'direct' | 'group';
  title?: string;
}
