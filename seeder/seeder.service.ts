import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { readFile } from 'fs';
import { Seeder } from './seeder.schema';

@Injectable()
export class SeederService {
  constructor(
    @Inject(Seeder.name)
    private readonly seederModel: Model<Seeder>,
  ) {}

  async create(key: string): Promise<void> {
    const document = await this.seederModel.create({ key });
    await document.save();
  }

  async exists(key: string): Promise<boolean> {
    const seeder = await this.seederModel.exists({ key });
    return Boolean(seeder);
  }

  async getSeeds<T>(seedName: 'certificates' | 'users') {
    return new Promise<T>((resolve, reject) => {
      readFile(
        `${process.cwd()}/dist/seeder/${seedName}.json`,
        'utf8',
        (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(JSON.parse(data));
        },
      );
    });
  }
}
