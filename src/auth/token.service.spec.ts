import { TokenService } from './token.service';
import { CONFIG_KEYS } from '../common/config-keys';
import { InternalServerErrorException } from '@nestjs/common';

export const MockUserService = {
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

const MOCK_CONFIG = {
  [CONFIG_KEYS.ACCESS_TOKEN_SIGN_KEY]: 'MOCK',
  [CONFIG_KEYS.ACCESS_TOKEN_EXPIRES_IN]: '1h',
};

const MockConfigService = {
  get: jest.fn((key) => MOCK_CONFIG[key]),
} as any;

const MOCK_ACCESS_TOKEN = 'MOCK_ACCESS_TOKEN';
const MOCK_TOKEN_PAYLOAD = {
  sub: 'MOCK_SUBJECT',
};

const MockJwtService = {
  signAsync: jest.fn(() => MOCK_ACCESS_TOKEN),
  verifyAsync: jest.fn(() => MOCK_TOKEN_PAYLOAD),
} as any;

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeEach(() => {
    tokenService = new TokenService(MockConfigService, MockJwtService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  describe('generateAccessToken', () => {
    it('should throw an InternalServerErrorException when signAsync throws', async () => {
      MockJwtService.signAsync.mockRejectedValueOnce('error');
      await expect(
        tokenService.generateAccessToken({ sub: 'MOCK_SUB' }),
      ).rejects.toBeInstanceOf(InternalServerErrorException);
    });

    it('should match the expected  payload and options for signAsync', async () => {
      const payload = { sub: 'MOCK_SUB' };

      await tokenService.generateAccessToken(payload);
      expect(MockJwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: MOCK_CONFIG[CONFIG_KEYS.ACCESS_TOKEN_SIGN_KEY],
        expiresIn: MOCK_CONFIG[CONFIG_KEYS.ACCESS_TOKEN_EXPIRES_IN],
      });
    });

    it('should return the token', async () => {
      const expectedToken = 'MOCK_TOKEN';
      MockJwtService.signAsync.mockResolvedValueOnce(expectedToken);
      await expect(
        tokenService.generateAccessToken({ sub: 'MOCK_SUB' }),
      ).resolves.toBe(expectedToken);
    });
  });

  describe('validateAccessToken', () => {
    it('should return null when verifyAsync throws', async () => {
      MockJwtService.verifyAsync.mockRejectedValueOnce('error');
      await expect(
        tokenService.validateAccessToken(MOCK_ACCESS_TOKEN),
      ).resolves.toBe(null);
    });

    it('should match the expected payload and options for verifyAsync', async () => {
      await tokenService.validateAccessToken(MOCK_ACCESS_TOKEN);
      expect(MockJwtService.verifyAsync).toHaveBeenCalledWith(
        MOCK_ACCESS_TOKEN,
        {
          secret: MOCK_CONFIG[CONFIG_KEYS.ACCESS_TOKEN_SIGN_KEY],
        },
      );
    });

    it('should return the token payload when verification passes', async () => {
      await expect(
        tokenService.validateAccessToken(MOCK_ACCESS_TOKEN),
      ).resolves.toBe(MOCK_TOKEN_PAYLOAD);
    });
  });
});
