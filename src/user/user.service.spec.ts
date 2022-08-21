import { User } from './user.schema';
import { UserService } from './user.service';

export const MockUserModel = {
  findOne: jest.fn(() => MockUserModel),
  select: jest.fn(),
} as any;

const MOCK_USER = {
  _id: 'MOCK_USER_ID',
  username: 'username',
  isActive: true,
} as User;

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(MockUserModel);
    jest.clearAllMocks();
  });

  describe('findByUsernameIncludePassword', () => {
    it('should call the findOne and match the username', async () => {
      await service.findByUsernameIncludePassword(MOCK_USER.username);
      expect(MockUserModel.findOne).toHaveBeenCalledWith({
        username: MOCK_USER.username,
      });
    });

    it('should match the expected list of fields to select', async () => {
      const expected = ['_id', 'isActive', 'password', 'username'];
      await expect(service.findByUsernameIncludePassword(MOCK_USER.username));
      expect(MockUserModel.select).toHaveBeenCalledWith(expected);
    });

    it('should return null when model returns null', async () => {
      MockUserModel.select.mockResolvedValueOnce(null);
      await expect(
        service.findByUsernameIncludePassword(MOCK_USER.username),
      ).resolves.toBe(null);
    });

    it('should throw when findOne throws', async () => {
      const error = new Error();
      MockUserModel.select.mockRejectedValueOnce(error);
      await expect(
        service.findByUsernameIncludePassword(MOCK_USER.username),
      ).rejects.toBe(error);
    });
  });
});
