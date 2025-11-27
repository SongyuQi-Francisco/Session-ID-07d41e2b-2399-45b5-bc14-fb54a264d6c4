import User from '@/models/User';
import { generateToken } from '@/utils/jwt';
import type { UserCreateInput, UserUpdateInput } from '@/types';

export const registerUser = async (userData: UserCreateInput) => {
  const { username, email, password, avatar, learningStyle } = userData;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('该邮箱已被注册');
    }
    if (existingUser.username === username) {
      throw new Error('该用户名已被使用');
    }
  }

  const user = new User({
    username,
    email,
    password,
    avatar,
    learningStyle,
  });

  await user.save();

  const token = generateToken(user._id.toString(), user.username, user.email);

  return {
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      learningStyle: user.learningStyle,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.isActive) {
    throw new Error('用户不存在或已被禁用');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new Error('密码错误');
  }

  const token = generateToken(user._id.toString(), user.username, user.email);

  return {
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      learningStyle: user.learningStyle,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  };
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select('-password');

  if (!user || !user.isActive) {
    throw new Error('用户不存在或已被禁用');
  }

  return user;
};

export const updateUser = async (userId: string, userData: UserUpdateInput) => {
  const { username, email, avatar, learningStyle } = userData;

  const existingUser = await User.findOne({
    $and: [
      { _id: { $ne: userId } },
      { $or: [{ email }, { username }] },
    ],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('该邮箱已被注册');
    }
    if (existingUser.username === username) {
      throw new Error('该用户名已被使用');
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { username, email, avatar, learningStyle },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new Error('用户不存在');
  }

  return user;
};

export const deactivateUser = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  ).select('-password');

  if (!user) {
    throw new Error('用户不存在');
  }

  return user;
};