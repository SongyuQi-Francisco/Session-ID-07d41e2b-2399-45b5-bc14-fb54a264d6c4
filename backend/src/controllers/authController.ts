import { Request, Response } from 'express';
import { registerUser, loginUser, getUserById, updateUser, deactivateUser } from '@/services/authService';
import type { ApiResponse } from '@/types';

export const register = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { username, email, password, avatar, learningStyle } = req.body;

    const result = await registerUser({
      username,
      email,
      password,
      avatar,
      learningStyle,
    });

    res.status(201).json({
      success: true,
      data: result,
      message: '注册成功',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '注册失败',
    });
  }
};

export const login = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      data: result,
      message: '登录成功',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : '登录失败',
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: '获取用户信息失败',
    });
  }
};

export const updateCurrentUser = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { username, email, avatar, learningStyle } = req.body;

    const user = await updateUser(req.userId, {
      username,
      email,
      avatar,
      learningStyle,
    });

    res.status(200).json({
      success: true,
      data: user,
      message: '用户信息更新成功',
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '更新用户信息失败',
    });
  }
};

export const deactivateCurrentUser = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const user = await deactivateUser(req.userId);

    res.status(200).json({
      success: true,
      data: user,
      message: '用户已停用',
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '停用用户失败',
    });
  }
};