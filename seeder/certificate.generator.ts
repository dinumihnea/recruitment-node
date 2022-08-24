import { faker } from '@faker-js/faker';
import { CertificateType } from '../src/certificate/certificate.schema';
import { CertificateStatus } from '../src/certificate/certificate-status.enum';
import { DEFAULT_TESTING_USER } from './user.generator';

const DEFAULT_TESTING_CERTIFICATES = [
  {
    _id: '63051f512c634740d03b3c09',
    status: CertificateStatus.OWNED,
    country: 'Denmark',
    owner: DEFAULT_TESTING_USER._id,
  },
  {
    _id: '63065e8958ab3e1109ab093e',
    status: CertificateStatus.AVAILABLE,
    country: 'Denmark',
    owner: DEFAULT_TESTING_USER._id,
  },
];

/**
 * Generates random fake certificates
 */
export async function generateRandomCertificates(
  count: number,
): Promise<Array<CertificateType>> {
  const certificates: Array<CertificateType> = [
    ...DEFAULT_TESTING_CERTIFICATES,
  ];
  while (certificates.length < count) {
    try {
      certificates.push({
        status: CertificateStatus.AVAILABLE,
        country: faker.address.country(),
      });
    } catch (error) {
      console.error(error);
    }
  }
  return certificates;
}
