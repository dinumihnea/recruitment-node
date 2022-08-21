import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { UserWithPasswordType } from '../src/user/user.schema';
import { EncryptionService } from '../src/auth/encryption.service';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../src/common/config-keys';

/**
 * Generates random fake users
 * The password for each user is set as `username1234`
 */
@Injectable()
export class UserGenerator {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly configService: ConfigService,
  ) {}

  async generateRandomUsers(
    count: number,
  ): Promise<Array<UserWithPasswordType>> {
    const users: Array<UserWithPasswordType> = [];
    while (users.length < count) {
      try {
        const username = faker.internet.userName();
        const password = await this.encryptionService.encrypt(
          username + '1234',
          Number(this.configService.get(CONFIG_KEYS.PASSWORD_HASH_SALT_ROUNDS)),
        );

        users.push({
          username,
          password,
          isActive: true,
        });
      } catch (error) {
        console.error(error);
      }
    }
    return users;
  }
}
