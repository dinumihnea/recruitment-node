import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Certificate } from './certificate.schema';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate.name) private certificateModel: Model<Certificate>,) {
  }


  async transferCertificate(id: string, newOwner: string): Promise<void> {

  }

  private async getCertificateById(id: string): Promise<Certificate> {
    return this.certificateModel.findById(id);
  }

  private validateTransfer(certificate: Certificate, newOwner: string): void {
    if (certificate.owner.toString() === newOwner) {
      throw new BadRequestException('New certificate owner must be different than existing owner');
    }
  }
}
