import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import User from '@/models/User';
import { registerUser, loginUser, getUserById, updateUser } from '@/services/authService';
import type { UserCreateInput, UserUpdateInput } from '@/types';

// 模拟 bcrypt
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('Auth Service', () => {
  beforeAll(async () => {
    // 连接到测试数据库
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/neuralprep_test');
  });

  afterAll(async () => {
    // 断开数据库连接
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // 在每个测试前清除数据库
    await User.deleteMany({});
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData: UserCreateInput = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        learningStyle: 'visual',
      };

      const result = await registerUser(userData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.username).toBe('testuser');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.learningStyle).toBe('visual');
      expect(result.user.isActive).toBe(true);

      // 验证用户是否保存到数据库
      const savedUser = await User.findOne({ email: 'test@example.com' });
      expect(savedUser).toBeTruthy();
      expect(savedUser?.username).toBe('testuser');
    });

    it('should throw error if email already exists', async () => {
      // 创建第一个用户
      const userData: UserCreateInput = {
        username: 'testuser1',
        email: 'test@example.com',
        password: 'password123',
      };
      await registerUser(userData);

      // 尝试用相同邮箱创建第二个用户
      const duplicateUserData: UserCreateInput = {
        username: 'testuser2',
        email: 'test@example.com',
        password: 'password456',
      };

      await expect(registerUser(duplicateUserData)).rejects.toThrow('该邮箱已被注册');
    });

    it('should throw error if username already exists', async () => {
      // 创建第一个用户
      const userData: UserCreateInput = {
        username: 'testuser',
        email: 'test1@example.com',
        password: 'password123',
      };
      await registerUser(userData);

      // 尝试用相同用户名创建第二个用户
      const duplicateUserData: UserCreateInput = {
        username: 'testuser',
        email: 'test2@example.com',
        password: 'password456',
      };

      await expect(registerUser(duplicateUserData)).rejects.toThrow('该用户名已被使用');
    });
  });

  describe('loginUser', () => {
    it('should login successfully with correct credentials', async () => {
      // 首先注册用户
      const userData: UserCreateInput = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      await registerUser(userData);

      // 尝试登录
      const result = await loginUser('test@example.com', 'password123');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.username).toBe('testuser');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error if email does not exist', async () => {
      await expect(loginUser('nonexistent@example.com', 'password123')).rejects.toThrow('用户不存在或已被禁用');
    });

    it('should throw error if password is incorrect', async () => {
      // 首先注册用户
      const userData: UserCreateInput = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      await registerUser(userData);

      // 使用错误的密码尝试登录
      await expect(loginUser('test@example.com', 'wrongpassword')).rejects.toThrow('密码错误');
    });

    it('should throw error if user is inactive', async () => {
      // 创建用户并设置为 inactive
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        isActive: false,
      });
      await user.save();

      // 尝试登录 inactive 用户
      await expect(loginUser('test@example.com', 'password123')).rejects.toThrow('用户不存在或已被禁用');
    });
  });

  describe('getUserById', () => {
    it('should get user by ID successfully', async () => {
      // 创建用户
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
      });
      await user.save();

      // 获取用户
      const result = await getUserById(user._id.toString());

      expect(result).toBeTruthy();
      expect(result?.username).toBe('testuser');
      expect(result?.email).toBe('test@example.com');
      expect(result?.password).toBeUndefined(); // 不应该返回密码
    });

    it('should throw error if user does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      await expect(getUserById(nonExistentId)).rejects.toThrow('用户不存在或已被禁用');
    });

    it('should throw error if user is inactive', async () => {
      // 创建 inactive 用户
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        isActive: false,
      });
      await user.save();

      await expect(getUserById(user._id.toString())).rejects.toThrow('用户不存在或已被禁用');
    });
  });

  describe('updateUser', () => {
    it('should update user information successfully', async () => {
      // 创建用户
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        learningStyle: 'visual',
      });
      await user.save();

      // 更新用户信息
      const updateData: UserUpdateInput = {
        username: 'newusername',
        email: 'newemail@example.com',
        learningStyle: 'auditory',
      };

      const result = await updateUser(user._id.toString(), updateData);

      expect(result).toBeTruthy();
      expect(result?.username).toBe('newusername');
      expect(result?.email).toBe('newemail@example.com');
      expect(result?.learningStyle).toBe('auditory');

      // 验证数据库中的用户是否已更新
      const updatedUser = await User.findById(user._id);
      expect(updatedUser?.username).toBe('newusername');
      expect(updatedUser?.email).toBe('newemail@example.com');
    });

    it('should throw error if email already exists', async () => {
      // 创建第一个用户
      const user1 = new User({
        username: 'user1',
        email: 'email1@example.com',
        password: 'hashedPassword',
      });
      await user1.save();

      // 创建第二个用户
      const user2 = new User({
        username: 'user2',
        email: 'email2@example.com',
        password: 'hashedPassword',
      });
      await user2.save();

      // 尝试将 user2 的邮箱更新为 user1 的邮箱
      const updateData: UserUpdateInput = {
        email: 'email1@example.com',
      };

      await expect(updateUser(user2._id.toString(), updateData)).rejects.toThrow('该邮箱已被注册');
    });

    it('should throw error if username already exists', async () => {
      // 创建第一个用户
      const user1 = new User({
        username: 'user1',
        email: 'email1@example.com',
        password: 'hashedPassword',
      });
      await user1.save();

      // 创建第二个用户
      const user2 = new User({
        username: 'user2',
        email: 'email2@example.com',
        password: 'hashedPassword',
      });
      await user2.save();

      // 尝试将 user2 的用户名更新为 user1 的用户名
      const updateData: UserUpdateInput = {
        username: 'user1',
      };

      await expect(updateUser(user2._id.toString(), updateData)).rejects.toThrow('该用户名已被使用');
    });
  });
});