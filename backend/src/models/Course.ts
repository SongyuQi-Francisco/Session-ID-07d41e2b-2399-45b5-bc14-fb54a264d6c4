import mongoose, { Schema, Document } from 'mongoose';
import type { Course as CourseType } from '@/types';

export interface CourseDocument extends CourseType, Document {}

const CourseSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '用户ID不能为空'],
      index: true,
    },
    name: {
      type: String,
      required: [true, '课程名称不能为空'],
      trim: true,
      minlength: [1, '课程名称至少1个字符'],
      maxlength: [50, '课程名称不能超过50个字符'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, '课程描述不能超过200个字符'],
      default: '',
    },
    color: {
      type: String,
      required: [true, '课程颜色不能为空'],
      match: [/^#[0-9A-Fa-f]{6}$/, '请输入有效的十六进制颜色代码'],
      default: '#10B981',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

CourseSchema.index({ userId: 1, name: 1 }, { unique: true });

CourseSchema.virtual('cardCount', {
  ref: 'KnowledgeCard',
  localField: '_id',
  foreignField: 'courseId',
  count: true,
  match: { status: { $ne: 'deleted' } },
});

CourseSchema.pre<CourseDocument>('remove', async function (next) {
  try {
    await mongoose.model('KnowledgeCard').updateMany(
      { courseId: this._id },
      { $unset: { courseId: 1 } }
    );

    await mongoose.model('LearningProgress').updateMany(
      { courseId: this._id },
      { $unset: { courseId: 1 } }
    );

    await mongoose.model('InputHistory').updateMany(
      { courseId: this._id },
      { $unset: { courseId: 1 } }
    );

    next();
  } catch (error) {
    next(error as Error);
  }
});

export default mongoose.model<CourseDocument>('Course', CourseSchema);