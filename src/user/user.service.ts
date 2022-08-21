import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByUsernameIncludePassword(username: string): Promise<User | null> {
    const selectedFields: Array<keyof User> = [
      '_id',
      'isActive',
      'password',
      'username',
    ];
    return this.userModel.findOne({ username }).select(selectedFields);
  }
}
