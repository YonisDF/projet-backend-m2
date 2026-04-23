import { Inject, Injectable, Logger } from '@nestjs/common';
import type { UserRepository } from '../ports/user.repository.port';
import { EmailBloomFilterService } from '../services/email-bloom-filter.service';
import { LocalCacheService } from '../services/local-cache.service';

type CheckEmailAvailabilityResult = {
  exists: boolean;
  checked: 'cache-hit' | 'bloom-negative' | 'database-confirmation';
  email: string;
};

@Injectable()
export class CheckEmailAvailabilityUsecase {
  private readonly logger = new Logger(CheckEmailAvailabilityUsecase.name);
  private readonly ttlSeconds = 60;

  constructor(
    @Inject('UserRepository')
    private readonly users: UserRepository,
    private readonly bloom: EmailBloomFilterService,
    private readonly cache: LocalCacheService,
  ) {}

  async execute(email: string): Promise<CheckEmailAvailabilityResult> {
    const normalizedEmail = this.normalizeEmail(email);
    const cacheKey = this.buildCacheKey(normalizedEmail);

    const cached = this.cache.get<CheckEmailAvailabilityResult>(cacheKey);
    if (cached) {
      this.logger.log(
        `[check-email] cache hit | email=${normalizedEmail} | exists=${cached.exists}`,
      );

      return {
        ...cached,
        checked: 'cache-hit',
      };
    }

    const mightExist = this.bloom.mightContain(normalizedEmail);

    if (!mightExist) {
      const result: CheckEmailAvailabilityResult = {
        email: normalizedEmail,
        exists: false,
        checked: 'bloom-negative',
      };

      this.cache.set(cacheKey, result, this.ttlSeconds);

      this.logger.log(
        `[check-email] bloom negative | email=${normalizedEmail} | dbSkipped=true`,
      );

      return result;
    }

    this.logger.log(
      `[check-email] bloom maybe present | email=${normalizedEmail} | queryingDb=true`,
    );

    const exists = await this.users.existsByEmail(normalizedEmail);

    const result: CheckEmailAvailabilityResult = {
      email: normalizedEmail,
      exists,
      checked: 'database-confirmation',
    };

    this.cache.set(cacheKey, result, this.ttlSeconds);

    this.logger.log(
      `[check-email] database confirmation | email=${normalizedEmail} | exists=${exists}`,
    );

    return result;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private buildCacheKey(email: string): string {
    return `auth:check-email:${email}`;
  }
}
