import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CertificateController } from './certificate.controller';
import { TransferCertificateDto } from './dto/transfer-certificate.dto';
import { User } from '../user/user.schema';
import { MyCertificateResponseDto } from './dto/my-certificate-response.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CertificateStatus } from './certificate-status.enum';
import { AvailableCertificateResponseDto } from './dto/available-certificate-response.dto';

const MOCK_USER = {
  _id: 'MOCK_USER_ID',
  username: 'username',
  isActive: true,
} as User;

const MockCertificateService = {
  listAvailableCertificates: jest.fn(),
  listCertificatesByOwner: jest.fn(),
  transferCertificate: jest.fn(),
} as any;

const MOCK_PAGINATION_DTO: PaginationQueryDto = {
  limit: 10,
  skip: 0,
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

  describe('getAvailableCertificates', () => {
    it('should pass the query DTO data to the service to listAvailableCertificates', async () => {
      await certificateController.getAvailableCertificates(MOCK_PAGINATION_DTO);
      expect(
        MockCertificateService.listAvailableCertificates,
      ).toHaveBeenCalledWith(
        MOCK_PAGINATION_DTO.limit,
        MOCK_PAGINATION_DTO.skip,
      );
    });

    it('should throw when listAvailableCertificates throws', async () => {
      MockCertificateService.listAvailableCertificates.mockImplementationOnce(
        () => Promise.reject(new InternalServerErrorException()),
      );
      await expect(
        certificateController.getAvailableCertificates(MOCK_PAGINATION_DTO),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('should provide the response from listAvailableCertificates', async () => {
      const MOCK_CERTIFICATE: AvailableCertificateResponseDto = {
        _id: 'MOCK_CERTIFICATE_ID',
        country: 'MOCK_COUNTRY',
        status: CertificateStatus.AVAILABLE,
      };
      MockCertificateService.listAvailableCertificates.mockImplementationOnce(
        () => Promise.resolve([MOCK_CERTIFICATE]),
      );
      await expect(
        certificateController.getAvailableCertificates(MOCK_PAGINATION_DTO),
      ).resolves.toEqual([MOCK_CERTIFICATE]);
    });
  });

  describe('getMyCertificates', () => {
    it('should pass the query DTO data to the service to listCertificatesByOwner', async () => {
      await certificateController.getMyCertificates(
        MOCK_PAGINATION_DTO,
        MOCK_USER,
      );
      expect(
        MockCertificateService.listCertificatesByOwner,
      ).toHaveBeenCalledWith(
        MOCK_USER._id,
        MOCK_PAGINATION_DTO.limit,
        MOCK_PAGINATION_DTO.skip,
      );
    });

    it('should throw when listCertificatesByOwner throws', async () => {
      MockCertificateService.listCertificatesByOwner.mockImplementationOnce(
        () => Promise.reject(new InternalServerErrorException()),
      );
      await expect(
        certificateController.getMyCertificates(MOCK_PAGINATION_DTO, MOCK_USER),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('should provide the response from listCertificatesByOwner', async () => {
      const MOCK_MY_CERTIFICATE: MyCertificateResponseDto = {
        _id: 'MOCK_CERTIFICATE_ID',
        country: 'MOCK_COUNTRY',
        owner: MOCK_USER._id,
        status: CertificateStatus.OWNED,
      };
      MockCertificateService.listCertificatesByOwner.mockImplementationOnce(
        () => Promise.resolve([MOCK_MY_CERTIFICATE]),
      );
      await expect(
        certificateController.getMyCertificates(MOCK_PAGINATION_DTO, MOCK_USER),
      ).resolves.toEqual([MOCK_MY_CERTIFICATE]);
    });
  });

  describe('transfer', () => {
    const MOCK_TRANSFER_CERTIFICATE_DTO: TransferCertificateDto = {
      id: 'MOCK_CERTIFICATE_ID',
      newOwnerId: 'MOCK_OWNER_ID',
    };

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
