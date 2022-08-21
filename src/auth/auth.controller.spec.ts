import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthRequestDto } from './dto/auth.dto';

const MOCK_ACCESS_TOKEN = 'MOCK_ACCESS_TOKEN';
const MockAuthService = {
  login: jest.fn(() => ({
    accessToken: MOCK_ACCESS_TOKEN,
  })),
} as any;

const MOCK_AUTH_REQUEST_DTO: AuthRequestDto = {
  username: 'MOCK_CERTIFICATE_ID',
  password: 'MOCK_PASSWORD',
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController(MockAuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should pass the DTO data to the service', async () => {
      await authController.login(MOCK_AUTH_REQUEST_DTO);
      expect(MockAuthService.login).toHaveBeenCalledWith(
        MOCK_AUTH_REQUEST_DTO.username,
        MOCK_AUTH_REQUEST_DTO.password,
      );
    });

    it('should throw when service throws', async () => {
      MockAuthService.login.mockImplementationOnce(() =>
        Promise.reject(new UnauthorizedException()),
      );

      await expect(
        authController.login(MOCK_AUTH_REQUEST_DTO),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should match the response dto', async () => {
      await expect(
        authController.login(MOCK_AUTH_REQUEST_DTO),
      ).resolves.toEqual({ accessToken: MOCK_ACCESS_TOKEN });
    });
  });
});
