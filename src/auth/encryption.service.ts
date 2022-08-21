import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CONFIG_KEYS } from '../common/config-keys';

@Injectable()
export class EncryptionService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Hashes password based on [Blowfish]{@link https://en.wikipedia.org/wiki/Blowfish} algorithm
   * @param password text to be hashed
   */
  async encrypt(password: string): Promise<string> {
    const salt = await this.generateSalt();
    return await bcrypt.hash(password, salt);
  }

  /**
   * Compares whether the password matches with the encrypted string
   * @param password plain text
   * @param encrypted hashed text
   */
  async compare(password: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(password, encrypted);
  }

  private async generateSalt(): Promise<string> {
    const rounds = Number(
      this.configService.get(CONFIG_KEYS.PASSWORD_HASH_SALT_ROUNDS),
    );

    return await bcrypt.genSalt(rounds);
  }
}
