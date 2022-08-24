import { CertificateController } from './certificate.controller';
import { TransferCertificateDto } from './dto/transfer-certificate.dto';
import { User } from '../user/user.schema';
import { NotFoundException } from '@nestjs/common';

const MockCertificateService = {
  transferCertificate: jest.fn(),
} as any;
const MOCK_USER = {
  _id: 'MOCK_USER_ID',
  username: 'username',
  isActive: true,
} as User;

const MOCK_TRANSFER_CERTIFICATE_DTO: TransferCertificateDto = {
  id: 'MOCK_CERTIFICATE_ID',
  newOwnerId: 'MOCK_OWNER_ID',
};

describe('CertificateController', () => {
  let certificateController: CertificateController;

  beforeEach(() => {
    certificateController = new CertificateController(MockCertificateService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(certificateController).toBeDefined();
  });

  describe('transfer', () => {
    it('should pass the DTO data to the service for transferCertificate', async () => {
      await certificateController.transfer(
        MOCK_TRANSFER_CERTIFICATE_DTO,
        MOCK_USER,
      );
      expect(MockCertificateService.transferCertificate).toHaveBeenCalledWith(
        MOCK_TRANSFER_CERTIFICATE_DTO.id,
        MOCK_TRANSFER_CERTIFICATE_DTO.newOwnerId,
        MOCK_USER,
      );
    });

    it('should throw when transferCertificate throws ', async () => {
      MockCertificateService.transferCertificate.mockImplementationOnce(() =>
        Promise.reject(new NotFoundException()),
      );
      await expect(
        certificateController.transfer(
          MOCK_TRANSFER_CERTIFICATE_DTO,
          MOCK_USER,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should provide the response from transferCertificate ', async () => {
      MockCertificateService.transferCertificate.mockImplementationOnce(() =>
        Promise.resolve(true),
      );
      await expect(
        certificateController.transfer(
          MOCK_TRANSFER_CERTIFICATE_DTO,
          MOCK_USER,
        ),
      ).resolves.toBe(true);
    });
  });
});
