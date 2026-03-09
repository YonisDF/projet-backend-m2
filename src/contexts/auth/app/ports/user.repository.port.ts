import { UserEntity } from '../../infra/persistence/entities/user.entity';

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;

  create(data: {
    email: string;
    passwordHash: string;
    displayName?: string | null;
  }): Promise<UserEntity>;

  existsByEmail(email: string): Promise<boolean>;
}
