import mongoose, { Schema, Document } from 'mongoose';
import type { LearningProgress as LearningProgressType } from '@/types';

export interface LearningProgressDocument extends LearningProgressType, Document {}

const LearningProgressSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '用户ID不能为空'],
      index: true,
    },
    cardId: {
      type: Schema.Types.ObjectId,
      ref: 'KnowledgeCard',
      required: [true, '卡片ID不能为空'],
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      index: true,
    },
    masteryLevel: {
      type: Number,
      required: [true, '掌握程度不能为空'],
      min: [0, '掌握程度不能小于0'],
      max: [100, '掌握程度不能大于100'],
      default: 0,
    },
    lastReviewed: {
      type: Date,
      required: [true, '最后复习时间不能为空'],
      default: Date.now,
    },
    reviewCount: {
      type: Number,
      required: [true, '复习次数不能为空'],
      min: [0, '复习次数不能小于0'],
      default: 0,
    },
    nextReviewDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, '笔记不能超过500个字符'],
      default: '',
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

LearningProgressSchema.index({ userId: 1, cardId: 1 }, { unique: true });
LearningProgressSchema.index({ userId: 1, courseId: 1 });
LearningProgressSchema.index({ userId: 1, nextReviewDate: 1 });

LearningProgressSchema.virtual('card', {
  ref: 'KnowledgeCard',
  localField: 'cardId',
  foreignField: '_id',
  justOne: true,
  select: 'title summary status difficulty',
});

LearningProgressSchema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true,
  select: 'name color',
});

LearningProgressSchema.pre<LearningProgressDocument>('save', function (next) {
  if (this.masteryLevel >= 80 && this.status !== 'mastered') {
    this.status = 'mastered';
  } else if (this.masteryLevel >= 40 && this.masteryLevel < 80 && this.status !== 'learning') {
    this.status = 'learning';
  } else if (this.masteryLevel < 40 && this.status !== 'pending') {
    this.status = 'pending';
  }

  if (this.isModified('masteryLevel') || this.isModified('lastReviewed')) {
    this.calculateNextReviewDate();
  }

  next();
});

LearningProgressSchema.methods.calculateNextReviewDate = function () {
  const now = new Date();
  const daysToAdd = this.masteryLevel < 20 ? 1 :
                   this.masteryLevel < 40 ? 2 :
                   this.masteryLevel < 60 ? 4 :
                   this.masteryLevel < 80 ? 7 : 14;

  this.nextReviewDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
};

export default mongoose.model<LearningProgressDocument>('LearningProgress', LearningProgressSchema);