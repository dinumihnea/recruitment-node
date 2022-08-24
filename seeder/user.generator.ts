import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserWithPasswordType } from '../src/user/user.schema';
import { EncryptionService } from '../src/auth/encryption.service';
import { CONFIG_KEYS } from '../src/common/config-keys';

export const DEFAULT_TESTING_USER = {
  _id: '63051f512c634740d03b3c74',
  username: 'username',
  password: 'username1234',
  isActive: true,
};

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
    const encryptionRounds = Number(
      this.configService.get(CONFIG_KEYS.PASSWORD_HASH_SALT_ROUNDS),
    );
    const users: Array<UserWithPasswordType> = [
      {
        ...DEFAULT_TESTING_USER,
        password: await this.encryptionService.encrypt(
          DEFAULT_TESTING_USER.password,
          encryptionRounds,
        ),
      },
    ];
    while (users.length < count) {
      try {
        const username = faker.internet.userName();
        const password = await this.encryptionService.encrypt(
          username + '1234',
          encryptionRounds,
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
