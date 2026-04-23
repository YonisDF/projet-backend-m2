import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EmailBloomFilterService {
  private bitArray!: Uint8Array;
  private m!: number;
  private k!: number;

  init(expectedItems = 100_000, falsePositiveRate = 0.01): void {
    const { m, k } = this.computeBloomParams(expectedItems, falsePositiveRate);
    this.m = m;
    this.k = k;
    this.bitArray = new Uint8Array(Math.ceil(m / 8));
  }

  normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private computeBloomParams(n: number, p: number): { m: number; k: number } {
    // p = false positive rate aimed, n = number of elements
    const m = Math.ceil(-(n * Math.log(p)) / Math.log(2) ** 2); // length of bit array
    const k = Math.max(1, Math.round((m / n) * Math.log(2))); // optimal number of hash needed
    return { m, k };
  }

  private digestPair(value: string): { h1: bigint; h2: bigint } {
    const normalized = this.normalizeEmail(value);

    const hash1 = crypto
      .createHash('sha256')
      .update(`h1:${normalized}`)
      .digest();
    const hash2 = crypto
      .createHash('sha256')
      .update(`h2:${normalized}`)
      .digest();

    const h1 = hash1.readBigUInt64BE(0);
    const h2 = hash2.readBigUInt64BE(0) || 1n;

    return { h1, h2 };
  }

  private getHashes(value: string): number[] {
    const { h1, h2 } = this.digestPair(value);
    const indexes: number[] = [];

    for (let i = 0; i < this.k; i++) {
      const idx = Number((h1 + BigInt(i) * h2) % BigInt(this.m));
      indexes.push(idx);
    }

    return indexes;
  }

  private setBit(index: number): void {
    const byteIndex = Math.floor(index / 8);
    const bitOffset = index % 8;
    this.bitArray[byteIndex] |= 1 << bitOffset;
  }

  private getBit(index: number): boolean {
    const byteIndex = Math.floor(index / 8);
    const bitOffset = index % 8;
    return (this.bitArray[byteIndex] & (1 << bitOffset)) !== 0;
  }

  // Calc indexes and set bit to 1
  add(email: string): void {
    const indexes = this.getHashes(email);
    for (const index of indexes) {
      this.setBit(index);
    }
  }

  mightContain(email: string): boolean {
    const indexes = this.getHashes(email);
    for (const index of indexes) {
      if (!this.getBit(index)) {
        return false;
      }
    }
    return true;
  }

  hydrateFromEmails(emails: string[]): void {
    for (const email of emails) {
      this.add(email);
    }
  }

  clear(): void {
    this.bitArray.fill(0);
  }

  stats(): { m: number; k: number; bytes: number } {
    return {
      m: this.m,
      k: this.k,
      bytes: this.bitArray.byteLength,
    };
  }
}
