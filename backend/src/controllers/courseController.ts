import { Request, Response } from 'express';
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getAllCoursesWithStats,
} from '@/services/courseService';
import type { ApiResponse } from '@/types';

export const createNewCourse = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { name, description, color } = req.body;

    const course = await createCourse(req.userId, {
      name,
      description,
      color,
    });

    res.status(201).json({
      success: true,
      data: course,
      message: '课程创建成功',
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '创建课程失败',
    });
  }
};

export const getUserCourses = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || '-createdAt';

    const result = await getCourses(req.userId, {
      page,
      limit,
      sort,
    });

    res.status(200).json({
      success: true,
      data: result.courses,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      error: '获取课程列表失败',
    });
  }
};

export const getCourse = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { courseId } = req.params;

    const course = await getCourseById(req.userId, courseId);

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(404).json({
      success: false,
      error: error instanceof Error ? error.message : '获取课程失败',
    });
  }
};

export const updateExistingCourse = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { courseId } = req.params;
    const { name, description, color, isActive } = req.body;

    const course = await updateCourse(req.userId, courseId, {
      name,
      description,
      color,
      isActive,
    });

    res.status(200).json({
      success: true,
      data: course,
      message: '课程更新成功',
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : '更新课程失败',
    });
  }
};

export const deleteExistingCourse = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const { courseId } = req.params;

    const result = await deleteCourse(req.userId, courseId);

    res.status(200).json({
      success: true,
      data: result,
      message: '课程删除成功',
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(404).json({
      success: false,
      error: error instanceof Error ? error.message : '删除课程失败',
    });
  }
};

export const getCourseStats = async (req: Request, res: Response<ApiResponse>): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        success: false,
        error: '用户未认证',
      });
      return;
    }

    const courses = await getAllCoursesWithStats(req.userId);

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({
      success: false,
      error: '获取课程统计失败',
    });
  }
};