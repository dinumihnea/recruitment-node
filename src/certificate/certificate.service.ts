import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Certificate } from './certificate.schema';
import { UserType } from '../user/user.schema';
import { CertificateStatus } from './certificate-status.enum';
import { AvailableCertificateResponseDto } from './dto/available-certificate-response.dto';
import { MyCertificateResponseDto } from './dto/my-certificate-response.dto';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate.name) private certificateModel: Model<Certificate>,
  ) {}

  async transferCertificate(
    id: string,
    newOwnerId: string,
    currentUser: UserType,
  ): Promise<boolean> {
    const certificate = await this.getCertificateByIdAndOwner(
      id,
      currentUser._id,
    );
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    this.validateTransfer(certificate, newOwnerId);

    return this.changeCertificateOwner(id, currentUser._id, newOwnerId);
  }

  async getCertificateByIdAndOwner(
    id: string,
    ownerId: string,
  ): Promise<Certificate | null> {
    return this.certificateModel.findOne({ id, owner: ownerId });
  }

  private async changeCertificateOwner(
    id: string,
    currentOwnerId: string,
    newOwnerId: string,
  ): Promise<boolean> {
    const updateResult = await this.certificateModel.updateOne(
      { id, owner: currentOwnerId },
      { owner: newOwnerId },
    );
    return Boolean(updateResult.modifiedCount);
  }

  async listAvailableCertificates(
    limit: number,
    skip: number,
  ): Promise<Array<AvailableCertificateResponseDto>> {
    return this.certificateModel
      .find<AvailableCertificateResponseDto>({
        status: CertificateStatus.AVAILABLE,
      })
      .skip(skip)
      .limit(limit)
      .select('_id country status')
      .exec();
  }

  async listCertificatesByOwner(
    ownerId: string,
    limit: number,
    skip: number,
  ): Promise<Array<MyCertificateResponseDto>> {
    return await this.certificateModel
      .find<MyCertificateResponseDto>({
        owner: ownerId,
      })
      .skip(skip)
      .limit(limit)
      .select('_id country status owner')
      .exec();
  }
  private validateTransfer(certificate: Certificate, newOwnerId: string): void {
    if (certificate.status !== CertificateStatus.OWNED) {
      throw new BadRequestException('Certificate cannot be transferred');
    }

    if (certificate.owner === newOwnerId) {
      throw new BadRequestException(
        'New certificate owner must be different than existing owner',
      );
    }
  }
}
