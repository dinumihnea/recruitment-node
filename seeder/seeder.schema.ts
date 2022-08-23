import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * DB model representing the list of seeders that were applied
 * The seeder is tracked by the `key` field
 */
@Schema({ timestamps: true })
export class Seeder extends Document {
  _id: string;

  @Prop({ required: true, unique: true })
  key: string;
}

export const SeederSchema = SchemaFactory.createForClass(Seeder);
export type SeederType = Partial<Seeder>;
