import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.schema';

// EncryptionService
export const MockEncryptionService = {
  compare: jest.fn(() => true),
} as any;

// TokenService
const MOCK_ACCESS_TOKEN = 'MOCK_ACCESS_TOKEN';
const MockTokenService = {
  validateAccessToken: jest.fn(() => ({ sub: 'USERNAME' })),
  generateAccessToken: jest.fn(() => MOCK_ACCESS_TOKEN),
} as any;

// UserService
const MOCK_USER = {
  _id: 'MOCK_USER_ID',
  username: 'username',
  isActive: true,
} as User;

export const MockUserService = {
  findByUsernameIncludePassword: jest.fn(() => MOCK_USER),
} as any;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(
      MockEncryptionService,
      MockTokenService,
      MockUserService,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should throw if authentication throws', async () => {
      const authenticateSpy = jest
        .spyOn(authService, 'authenticate')
        .mockImplementationOnce(() =>
          Promise.reject(new UnauthorizedException()),
        );

      await expect(
        authService.login(MOCK_USER.username, MOCK_USER.password),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(authenticateSpy).toHaveBeenCalledWith(MOCK_USER.username);
    });

    it('should throw an UnauthorizedException given password is not a match', async () => {
      MockEncryptionService.compare.mockResolvedValueOnce(false);
      const password = 'mock_password';
      await expect(
        authService.login(MOCK_USER.username, password),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(MockEncryptionService.compare).toHaveBeenCalledWith(
        password,
        MOCK_USER.password,
      );
    });

    it('should throw an UnauthorizedException given user is not active', async () => {
      const authenticateSpy = jest
        .spyOn(authService, 'authenticate')
        .mockImplementationOnce(() =>
          Promise.resolve({ ...MOCK_USER, isActive: false } as User),
        );

      await expect(
        authService.login(MOCK_USER.username, MOCK_USER.password),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(authenticateSpy).toHaveBeenCalled();
    });

    // Happy scenario
    it('should generate access token when user is valid', async () => {
      MockTokenService.generateAccessToken.mockResolvedValueOnce(
        MOCK_ACCESS_TOKEN,
      );
      await expect(
        authService.login(MOCK_USER.username, MOCK_USER.password),
      ).resolves.toMatchObject({ accessToken: MOCK_ACCESS_TOKEN });
      expect(MockTokenService.generateAccessToken).toHaveBeenCalled();
    });
  });

  describe('isAuthorized', () => {
    it('should match with user isActive', async () => {
      expect(
        authService.isUserAuthorized({ ...MOCK_USER, isActive: false } as User),
      ).toBe(false);
      expect(
        authService.isUserAuthorized({ ...MOCK_USER, isActive: true } as User),
      ).toBe(true);
    });
  });

  describe('authenticate', () => {
    it('should throw an UnauthorizedException when user is not found', async () => {
      MockUserService.findByUsernameIncludePassword.mockResolvedValueOnce(null);
      await expect(
        authService.authenticate(MOCK_USER.username),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should provide the user', async () => {
      await expect(
        authService.authenticate(MOCK_USER.username),
      ).resolves.toEqual(MOCK_USER);
    });
  });
});
