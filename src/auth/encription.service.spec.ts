import { EncryptionService } from './encryption.service';
import * as bcryptMock from 'bcrypt';

jest.mock('bcrypt');

describe('EncryptionService', () => {
  let encryptionService: EncryptionService;

  beforeEach(async () => {
    encryptionService = new EncryptionService();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(encryptionService).toBeDefined();
  });

  describe('compare', () => {
    const text = 'qwerty';
    const encrypted = 'ytrewq';

    // Input

    it('should call bcrypt compare', async () => {
      await encryptionService.compare(text, encrypted);
      expect(bcryptMock.compare).toHaveBeenCalled();
    });

    it('should match the params sent to bcrypt compare', async () => {
      await encryptionService.compare(text, encrypted);
      expect(bcryptMock.compare).toHaveBeenCalledWith(text, encrypted);
    });

    // Errors

    it('should rethrow the error thrown by compare from bcrypt', async () => {
      const error = 'error';
      bcryptMock.compare.mockRejectedValueOnce(error);
      await expect(encryptionService.compare(text, encrypted)).rejects.toBe(
        error,
      );
    });

    // Happy scenarios

    it('should return true when bcrypt compare returns true', async () => {
      bcryptMock.compare.mockResolvedValueOnce(true);
      await expect(encryptionService.compare(text, encrypted)).resolves.toBe(
        true,
      );
    });

    it('should return false when bcrypt compare returns false', async () => {
      bcryptMock.compare.mockResolvedValueOnce(false);
      await expect(encryptionService.compare(text, encrypted)).resolves.toBe(
        false,
      );
    });
  });

  describe('encrypt', () => {
    const text = 'text';
    const rounds = 1;
    const salt = 'salt';

    // Input

    it('should call generateSalt method from the service and match param', async () => {
      const spy = jest.spyOn(encryptionService, 'generateSalt');
      await encryptionService.encrypt(text, rounds);
      expect(spy).toHaveBeenCalledWith(rounds);
    });

    it('should call bcrypt hash', async () => {
      await encryptionService.encrypt(text, rounds);
      expect(bcryptMock.hash).toHaveBeenCalled();
    });

    it('should match the params sent to bcrypt genSalt', async () => {
      bcryptMock.genSalt.mockResolvedValueOnce(salt);

      await encryptionService.encrypt(text, rounds);
      expect(bcryptMock.hash).toHaveBeenCalledWith(text, salt);
    });

    // Errors
    const error = 'error';

    it('should rethrow the error thrown by bcrypt genSalt method ', async () => {
      bcryptMock.genSalt.mockRejectedValueOnce(error);
      await expect(encryptionService.encrypt(text, rounds)).rejects.toBe(error);
    });

    it('should not call hash method from bcrypt when generateSalt failed ', async () => {
      bcryptMock.genSalt.mockRejectedValueOnce(error);
      await expect(encryptionService.encrypt(text, rounds)).rejects.toBe(error);
      expect(bcryptMock.hash).not.toHaveBeenCalled();
    });

    it('should rethrow the error thrown by bcrypt hash method ', async () => {
      bcryptMock.genSalt.mockResolvedValueOnce(salt);
      bcryptMock.hash.mockRejectedValueOnce(error);

      await expect(encryptionService.encrypt(text, rounds)).rejects.toBe(error);
      expect(bcryptMock.genSalt).toHaveBeenCalled();
    });

    // Happy scenarios

    it('should match the value returned by bcrypt hash method', async () => {
      const hashed = 'hashed';
      bcryptMock.genSalt.mockResolvedValueOnce(salt);
      bcryptMock.hash.mockResolvedValueOnce(hashed);

      await expect(encryptionService.encrypt(text, rounds)).resolves.toBe(
        hashed,
      );
    });
  });

  describe('generateSalt', () => {
    const rounds = 1;
    it('should call bcrypt genSalt', async () => {
      await encryptionService.generateSalt(rounds);
      expect(bcryptMock.genSalt).toHaveBeenCalled();
    });

    it('should match the params sent to bcrypt genSalt', async () => {
      await encryptionService.generateSalt(rounds);
      expect(bcryptMock.genSalt).toHaveBeenCalledWith(rounds);
    });

    // Errors

    it('should rethrow the error thrown by bcrypt genSalt method ', async () => {
      const error = 'error';
      bcryptMock.genSalt.mockRejectedValueOnce(error);
      await expect(encryptionService.generateSalt(rounds)).rejects.toBe(error);
    });

    // Happy scenarios

    it('should match the salt returned by bcrypt genSalt', async () => {
      const salt = 'salt';

      bcryptMock.genSalt.mockResolvedValueOnce(salt);
      await expect(encryptionService.generateSalt(rounds)).resolves.toBe(salt);
    });
  });
});
