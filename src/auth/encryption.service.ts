import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  /**
   * Hashes password based on [Blowfish]{@link https://en.wikipedia.org/wiki/Blowfish} algorithm
   * @param password text to be hashed
   * @param rounds nr of rounds to encrypt the string
   */
  async encrypt(password: string, rounds: number): Promise<string> {
    const salt = await this.generateSalt(rounds);
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

  async generateSalt(rounds: number): Promise<string> {
    return await bcrypt.genSalt(rounds);
  }
}
