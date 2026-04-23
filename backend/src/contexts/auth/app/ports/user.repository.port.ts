import type { UserEntity } from '../../infra/persistence/entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;

  findByEmail(email: string): Promise<UserEntity | null>;

  existsByEmail(email: string): Promise<boolean>;

  findAllEmails(): Promise<string[]>;

  create(data: {
    email: string;
    passwordHash: string;
    displayName: string | null;
  }): Promise<void>;
}
