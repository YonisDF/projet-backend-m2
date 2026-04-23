import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import type { UserRepository } from '../../../app/ports/user.repository.port';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    displayName: string | null;
  }): Promise<void> {
    const entity = this.repo.create({
      email: data.email,
      passwordHash: data.passwordHash,
      displayName: data.displayName,
    });

    await this.repo.save(entity);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repo.count({ where: { email } });
    return count > 0;
  }

  async findAllEmails(): Promise<string[]> {
    const users = await this.repo.find({
      select: {
        email: true,
      },
    });

    return users.map((user) => user.email);
  }
}
