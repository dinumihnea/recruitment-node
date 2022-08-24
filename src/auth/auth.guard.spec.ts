import { AuthGuard } from './auth.guard';
import { User } from '../user/user.schema';

const MOCK_USER = {
  _id: 'MOCK_USER_ID',
  username: 'username',
  isActive: true,
} as User;

const MockAuthService = {
  authenticate: jest.fn(() => MOCK_USER),
  isUserAuthorized: jest.fn(() => true),
} as any;

const MockTokenService = {
  validateAccessToken: jest.fn(() => ({ sub: 'USERNAME' })),
} as any;

const MOCK_AUTHORIZATION_TOKEN = 'MOCK_AUTHORIZATION_TOKEN';

const MOCK_REQUEST = {
  headers: {
    authorization: `Bearer ${MOCK_AUTHORIZATION_TOKEN}`,
  },
};

const MOCK_CONTEXT = {
  switchToHttp: jest.fn(() => MOCK_CONTEXT),
  getRequest: jest.fn(() => MOCK_REQUEST),
};
describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  beforeEach(async () => {
    authGuard = new AuthGuard(MockAuthService, MockTokenService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  describe('canActivate', () => {
    // Input

    // it('should call bcrypt compare', async () => {
    //   await authGuard.canActivate(MOCK_CONTEXT);
    //   expect(bcryptMock.compare).toHaveBeenCalled();
    // });
    //
    // it('should match the params sent to bcrypt compare', async () => {
    //   await authGuard.compare(text, encrypted);
    //   expect(bcryptMock.compare).toHaveBeenCalledWith(text, encrypted);
    // });

    it.each`
      authorization            | expected
      ${undefined}             | ${false}
      ${'INVALID'}             | ${false}
      ${'Bearer'}              | ${false}
      ${'Bearer ACCESS_TOKEN'} | ${true}
    `(
      'should return $expected when authorization header is $authorization',
      async ({ authorization, expected }) => {
        const context = {
          switchToHttp: () => context,
          getRequest: () => ({
            headers: {
              authorization,
            },
          }),
        } as any;

        await expect(authGuard.canActivate(context)).resolves.toBe(expected);
      },
    );

    it('should return false when authentication fails', async () => {
      MockAuthService.authenticate.mockRejectedValueOnce('error');
      await expect(authGuard.canActivate(MOCK_CONTEXT)).resolves.toBe(false);
    });

    it('should return false when user is not found ', async () => {
      MockAuthService.authenticate.mockResolvedValueOnce(null);
      await expect(authGuard.canActivate(MOCK_CONTEXT)).resolves.toBe(false);
    });

    it('should return false when user is not authorized', async () => {
      MockAuthService.isUserAuthorized.mockReturnValueOnce(false);
      await expect(authGuard.canActivate(MOCK_CONTEXT)).resolves.toBe(false);
    });

    it('should return false when token validation fails', async () => {
      MockTokenService.validateAccessToken.mockResolvedValueOnce(null);
      await expect(authGuard.canActivate(MOCK_CONTEXT)).resolves.toBe(false);
    });

    it('should return false when token does not contain the subject', async () => {
      MockTokenService.validateAccessToken.mockResolvedValueOnce({});
      await expect(authGuard.canActivate(MOCK_CONTEXT)).resolves.toBe(false);
    });

    // Happy scenario
    it('should populate the user in the request', async () => {
      await expect(authGuard.canActivate(MOCK_CONTEXT)).resolves.toBe(true);
      expect(MOCK_REQUEST['user']).toMatchObject(MOCK_USER);
    });
  });
});
