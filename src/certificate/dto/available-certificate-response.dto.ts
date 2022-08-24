import { CertificateStatus } from '../certificate-status.enum';

export interface AvailableCertificateResponseDto {
  _id: string;

  country: string;

  status: CertificateStatus;
}
