export type ConversationType = 'direct' | 'group';

export interface ConversationProps {
  id: string;
  type: ConversationType;
  title?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Conversation {
  private constructor(private readonly props: ConversationProps) {}

  static rehydrate(props: ConversationProps): Conversation {
    return new Conversation(props);
  }

  get id(): string {
    return this.props.id;
  }

  get type(): ConversationType {
    return this.props.type;
  }

  get title(): string | null {
    return this.props.title ?? null;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  rename(title: string) {
    this.props.title = title;
  }

  toJSON() {
    return { ...this.props };
  }
}
