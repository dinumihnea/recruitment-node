import { CertificateService } from './certificate.service';
import { Certificate } from './certificate.schema';
import { CertificateStatus } from './certificate-status.enum';
import { User } from '../user/user.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export const MockCertificateModel = {
  findOne: jest.fn(),
  updateOne: jest.fn(() =>
    Promise.resolve({
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: undefined,
      acknowledged: true,
    }),
  ),
} as any;

const MOCK_CERTIFICATE_ID = 'MOCK_CERTIFICATE_ID';
const MOCK_OWNER_ID = 'MOCK_OWNER_ID';

const MOCK_USER = {
  _id: 'MOCK_USER_ID',
  username: 'username',
  isActive: true,
} as User;

const MOCK_CERTIFICATE = {
  _id: MOCK_CERTIFICATE_ID,
  status: CertificateStatus.OWNED,
  owner: MOCK_USER._id,
} as Certificate;

describe('CertificateService', () => {
  let service: CertificateService;

  beforeEach(() => {
    service = new CertificateService(MockCertificateModel);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transferCertificate', () => {
    it('should throw a NotFoundException when the certificate is not found', async () => {
      const getCertificateByIdAndOwnerSpy = jest
        .spyOn(service, 'getCertificateByIdAndOwner')
        .mockResolvedValueOnce(null);

      await expect(
        service.transferCertificate(
          MOCK_CERTIFICATE_ID,
          MOCK_OWNER_ID,
          MOCK_USER,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(getCertificateByIdAndOwnerSpy).toHaveBeenCalled();
    });

    it.each`
      status                           | error
      ${CertificateStatus.AVAILABLE}   | ${BadRequestException}
      ${CertificateStatus.TRANSFERRED} | ${BadRequestException}
    `(
      'should throw ane error when the certificate is not $status',
      async ({ status, error }) => {
        const getCertificateByIdAndOwnerSpy = jest
          .spyOn(service, 'getCertificateByIdAndOwner')
          .mockResolvedValueOnce({
            ...MOCK_CERTIFICATE,
            status,
          } as Certificate);

        await expect(
          service.transferCertificate(
            MOCK_CERTIFICATE_ID,
            MOCK_OWNER_ID,
            MOCK_USER,
          ),
        ).rejects.toBeInstanceOf(error);
        expect(getCertificateByIdAndOwnerSpy).toHaveBeenCalled();
      },
    );

    it('should throw a BadRequestException when the certificate owner matches with new owner', async () => {
      const getCertificateByIdAndOwnerSpy = jest
        .spyOn(service, 'getCertificateByIdAndOwner')
        .mockResolvedValueOnce({
          ...MOCK_CERTIFICATE,
          owner: MOCK_USER._id,
        } as Certificate);

      await expect(
        service.transferCertificate(
          MOCK_CERTIFICATE_ID,
          MOCK_USER._id,
          MOCK_USER,
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(getCertificateByIdAndOwnerSpy).toHaveBeenCalled();
    });

    // Happy scenario
    it('should change the certificate owner', async () => {
      const getCertificateByIdAndOwnerSpy = jest
        .spyOn(service, 'getCertificateByIdAndOwner')
        .mockResolvedValueOnce(MOCK_CERTIFICATE);

      await expect(
        service.transferCertificate(
          MOCK_CERTIFICATE_ID,
          MOCK_OWNER_ID,
          MOCK_USER,
        ),
      ).resolves.toBe(true);

      expect(getCertificateByIdAndOwnerSpy).toHaveBeenCalled();
      expect(MockCertificateModel.updateOne).toHaveBeenCalledWith(
        { id: MOCK_CERTIFICATE_ID, owner: MOCK_USER._id },
        { owner: MOCK_OWNER_ID },
      );
    });
  });

  describe('getCertificateByIdAndOwner', () => {
    it('should call the findOne and match the id and ownerId', async () => {
      await service.getCertificateByIdAndOwner(
        MOCK_CERTIFICATE_ID,
        MOCK_OWNER_ID,
      );
      expect(MockCertificateModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          id: MOCK_CERTIFICATE_ID,
          owner: MOCK_OWNER_ID,
        }),
      );
    });

    it('should return null when findOne returns null', async () => {
      MockCertificateModel.findOne.mockResolvedValueOnce(null);
      await expect(
        service.getCertificateByIdAndOwner(MOCK_CERTIFICATE_ID, MOCK_OWNER_ID),
      ).resolves.toBe(null);
    });

    it('should throw when findOne throws an error', async () => {
      const error = new Error();
      MockCertificateModel.findOne.mockRejectedValueOnce(error);
      await expect(
        service.getCertificateByIdAndOwner(MOCK_CERTIFICATE_ID, MOCK_OWNER_ID),
      ).rejects.toBe(error);
    });
  });
});
