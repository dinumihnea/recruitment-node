import { faker } from '@faker-js/faker';
import { CertificateType } from '../src/certificate/certificate.schema';
import { CertificateStatus } from '../src/certificate/certificate-status.enum';

/**
 * Generates random fake certificates
 */
export async function generateRandomCertificates(
  count: number,
): Promise<Array<CertificateType>> {
  const certificates: Array<CertificateType> = [];
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
