import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  _id: string;

  /**
   * Flag indicating if user is authorized to access the API
   */
  @Prop({ required: true, type: Boolean })
  isActive: boolean;

  @Prop({ required: false, select: false })
  password: string;

  @Prop({ required: true, unique: true })
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserType = Omit<User, 'password'>;
