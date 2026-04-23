import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import type { UserRepository } from '../ports/user.repository.port';
import { EmailBloomFilterService } from './email-bloom-filter.service';

@Injectable()
export class EmailBloomWarmupService implements OnModuleInit {
  constructor(
    @Inject('UserRepository')
    private readonly users: UserRepository,
    private readonly bloom: EmailBloomFilterService,
  ) {}

  async onModuleInit() {
    this.bloom.init(100_000, 0.01);

    const emails = await this.users.findAllEmails();
    this.bloom.hydrateFromEmails(emails);
  }
}
