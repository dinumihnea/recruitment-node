import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CertificateStatus } from './certificate-status.enum';
import { User } from '../user/user.schema';

@Schema({ timestamps: true })
export class Certificate extends Document {
  /**
   * A uuid generated by MongoDB
   */
  _id: mongoose.Types.ObjectId | string;

  @Prop({
    type: String,
    required: true,
  })
  country: string;

  /**
   * The date and time when the Document was created
   * Value for this field automatically generated by mongoose
   */
  createdAt: Date;

  /**
   * The user that currently owns the certificate
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  owner?: mongoose.Types.ObjectId | string;

  /**
   * Current certificate status
   */
  @Prop({
    type: String,
    enum: Object.values(CertificateStatus),
    required: true,
  })
  status: CertificateStatus;

  /**
   * The last date-time when the Document was updated
   * Value for this field automatically generated by mongoose
   */
  updatedAt: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
export type CertificateType = Partial<Certificate>;
