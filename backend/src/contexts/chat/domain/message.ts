export interface MessageProps {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  editedAt?: Date | null;
  deletedAt?: Date | null;
}

export class Message {
  private constructor(private readonly props: MessageProps) {}

  static rehydrate(props: MessageProps): Message {
    return new Message(props);
  }

  get id(): string {
    return this.props.id;
  }

  get conversationId(): string {
    return this.props.conversationId;
  }

  get senderId(): string {
    return this.props.senderId;
  }

  get content(): string {
    return this.props.content;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get editedAt(): Date | null {
    return this.props.editedAt ?? null;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt ?? null;
  }

  isDeleted(): boolean {
    return !!this.props.deletedAt;
  }

  toJSON() {
    return { ...this.props };
  }
}
