import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../infra/persistence/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  findById(id: string): Promise<UserEntity | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    displayName?: string | null;
  }): Promise<UserEntity> {
    const user = this.usersRepo.create({
      email: data.email,
      passwordHash: data.passwordHash,
      displayName: data.displayName ?? null,
    });
    return this.usersRepo.save(user);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.usersRepo.count({ where: { email } });
    return count > 0;
  }
}
