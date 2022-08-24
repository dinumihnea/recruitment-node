import { CertificateStatus } from '../certificate-status.enum';

export interface MyCertificateResponseDto {
  _id: string;

  country: string;

  status: CertificateStatus;

  owner: string;
}
