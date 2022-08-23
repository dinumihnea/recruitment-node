import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from '../src/common/config-keys';
import mongoose, { Connection, Model, Mongoose } from 'mongoose';
import {
  User,
  UserSchema,
  UserType,
  UserWithPasswordType,
} from '../src/user/user.schema';
import { EncryptionService } from '../src/auth/encryption.service';
import {
  Certificate,
  CertificateSchema,
  CertificateType,
} from '../src/certificate/certificate.schema';
import { generateRandomCertificates } from './certificate.generator';
import { createSeed } from './seeder.generator';
import { UserGenerator } from './user.generator';
import { Seeder, SeederSchema } from './seeder.schema';
import { SeederService } from './seeder.service';

const DATABASE_CONNECTION_KEY = 'DB_CONNECTION';

/**
 * A standalone module used for seeding random generated data in the database
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development'],
    }),
  ],
  providers: [
    {
      inject: [ConfigService],
      provide: DATABASE_CONNECTION_KEY,
      useFactory: async (
        configService: ConfigService,
      ): Promise<typeof mongoose> =>
        await mongoose.connect(configService.get(CONFIG_KEYS.DATABASE_URI)),
    },
    {
      provide: User.name,
      useFactory: (connection: Connection) =>
        connection.model(User.name, UserSchema),
      inject: [DATABASE_CONNECTION_KEY],
    },
    {
      provide: Certificate.name,
      useFactory: (connection: Connection) =>
        connection.model(Certificate.name, CertificateSchema),
      inject: [DATABASE_CONNECTION_KEY],
    },
    {
      provide: Seeder.name,
      useFactory: (connection: Connection) =>
        connection.model(Seeder.name, SeederSchema),
      inject: [DATABASE_CONNECTION_KEY],
    },
    EncryptionService,
    SeederService,
    UserGenerator,
  ],
})
export class SeederModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(DATABASE_CONNECTION_KEY)
    private readonly mongoose: Mongoose,
    private readonly userGenerator: UserGenerator,
    private readonly seederService: SeederService,
    @Inject(Certificate.name)
    private readonly certificateModel: Model<Certificate>,
    @Inject(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async generateRandomSeeds(): Promise<void> {
    const certificates = await generateRandomCertificates(100);
    await createSeed<CertificateType>('certificates', certificates);

    const users = await this.userGenerator.generateRandomUsers(10);
    await createSeed<UserType>('users', users);
  }

  async applySeeders(): Promise<void> {
    const certificateSeeds = await this.seederService.getSeeds<{
      seederKey: string;
      certificates: Array<CertificateType>;
    }>('certificates');
    const certificateSeedExists = await this.seederService.exists(
      certificateSeeds.seederKey,
    );
    if (!certificateSeedExists) {
      await this.certificateModel.insertMany(certificateSeeds.certificates);
      await this.seederService.create(certificateSeeds.seederKey);
      console.log('Certificate seeds successfully stored');
    }

    const userSeeds = await this.seederService.getSeeds<{
      seederKey: string;
      users: Array<UserWithPasswordType>;
    }>('users');
    const userSeedExists = await this.seederService.exists(userSeeds.seederKey);
    if (!userSeedExists) {
      await this.userModel.insertMany(userSeeds.users);
      await this.seederService.create(userSeeds.seederKey);
      console.log('User seeds successfully stored');
    }
  }

  async onModuleInit(): Promise<void> {
    if (process.argv.includes('generate')) {
      await this.generateRandomSeeds();
    } else {
      await this.applySeeders();
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.mongoose.disconnect();
  }
}
