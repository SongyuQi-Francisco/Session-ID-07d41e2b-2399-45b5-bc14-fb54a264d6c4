import mongoose, { Schema, Document } from 'mongoose';
import type { KnowledgeCard as KnowledgeCardType } from '@/types';

export interface KnowledgeCardDocument extends KnowledgeCardType, Document {}

const KnowledgeCardSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '用户ID不能为空'],
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      index: true,
    },
    title: {
      type: String,
      required: [true, '知识点标题不能为空'],
      trim: true,
      minlength: [1, '知识点标题至少1个字符'],
      maxlength: [100, '知识点标题不能超过100个字符'],
    },
    summary: {
      type: String,
      required: [true, '知识点摘要不能为空'],
      trim: true,
      minlength: [10, '知识点摘要至少10个字符'],
      maxlength: [500, '知识点摘要不能超过500个字符'],
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'mastered', 'learning'],
      default: 'pending',
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [50, '标签不能超过50个字符'],
      },
    ],
    relatedCards: [
      {
        type: Schema.Types.ObjectId,
        ref: 'KnowledgeCard',
      },
    ],
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

KnowledgeCardSchema.index({ userId: 1, title: 'text' });
KnowledgeCardSchema.index({ userId: 1, courseId: 1, status: 1 });
KnowledgeCardSchema.index({ userId: 1, difficulty: 1 });

KnowledgeCardSchema.virtual('progress', {
  ref: 'LearningProgress',
  localField: '_id',
  foreignField: 'cardId',
  justOne: true,
});

KnowledgeCardSchema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true,
  select: 'name color',
});

KnowledgeCardSchema.pre<KnowledgeCardDocument>('remove', async function (next) {
  try {
    await mongoose.model('LearningProgress').deleteMany({ cardId: this._id });
    await mongoose.model('KnowledgeCard').updateMany(
      { relatedCards: this._id },
      { $pull: { relatedCards: this._id } }
    );
    next();
  } catch (error) {
    next(error as Error);
  }
});

export default mongoose.model<KnowledgeCardDocument>('KnowledgeCard', KnowledgeCardSchema);