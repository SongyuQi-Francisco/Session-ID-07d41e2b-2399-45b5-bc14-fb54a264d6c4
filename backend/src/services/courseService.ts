import Course from '@/models/Course';
import type { CourseCreateInput, CourseUpdateInput, PaginationOptions } from '@/types';

export const createCourse = async (userId: string, courseData: CourseCreateInput) => {
  const { name, description, color = '#10B981' } = courseData;

  const existingCourse = await Course.findOne({
    userId,
    name,
  });

  if (existingCourse) {
    throw new Error('该课程名称已存在');
  }

  const course = new Course({
    userId,
    name,
    description: description || '',
    color,
  });

  await course.save();

  return course;
};

export const getCourses = async (
  userId: string,
  options: PaginationOptions = {}
) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = options;

  const query = {
    userId,
    isActive: true,
  };

  const skip = (page - 1) * limit;

  const [courses, total] = await Promise.all([
    Course.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('cardCount')
      .lean(),
    Course.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    courses,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const getCourseById = async (userId: string, courseId: string) => {
  const course = await Course.findOne({
    _id: courseId,
    userId,
    isActive: true,
  }).populate('cardCount');

  if (!course) {
    throw new Error('课程不存在或已被删除');
  }

  return course;
};

export const updateCourse = async (
  userId: string,
  courseId: string,
  courseData: CourseUpdateInput
) => {
  const { name, description, color, isActive } = courseData;

  if (name) {
    const existingCourse = await Course.findOne({
      _id: { $ne: courseId },
      userId,
      name,
      isActive: true,
    });

    if (existingCourse) {
      throw new Error('该课程名称已存在');
    }
  }

  const course = await Course.findOneAndUpdate(
    {
      _id: courseId,
      userId,
    },
    { name, description, color, isActive },
    { new: true, runValidators: true }
  ).populate('cardCount');

  if (!course) {
    throw new Error('课程不存在或已被删除');
  }

  return course;
};

export const deleteCourse = async (userId: string, courseId: string) => {
  const course = await Course.findOne({
    _id: courseId,
    userId,
  });

  if (!course) {
    throw new Error('课程不存在或已被删除');
  }

  await course.remove();

  return {
    message: '课程已删除',
    courseId,
  };
};

export const getAllCoursesWithStats = async (userId: string) => {
  const courses = await Course.aggregate([
    {
      $match: {
        userId,
        isActive: true,
      },
    },
    {
      $lookup: {
        from: 'knowledgecards',
        localField: '_id',
        foreignField: 'courseId',
        as: 'cards',
      },
    },
    {
      $addFields: {
        totalCards: { $size: '$cards' },
        masteredCards: {
          $size: {
            $filter: {
              input: '$cards',
              as: 'card',
              cond: { $eq: ['$$card.status', 'mastered'] },
            },
          },
        },
        learningCards: {
          $size: {
            $filter: {
              input: '$cards',
              as: 'card',
              cond: { $eq: ['$$card.status', 'learning'] },
            },
          },
        },
        pendingCards: {
          $size: {
            $filter: {
              input: '$cards',
              as: 'card',
              cond: { $eq: ['$$card.status', 'pending'] },
            },
          },
        },
      },
    },
    {
      $project: {
        cards: 0,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return courses;
};