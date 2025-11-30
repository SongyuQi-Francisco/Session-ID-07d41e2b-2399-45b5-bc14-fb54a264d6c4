import mongoose, { Schema, Document } from 'mongoose';
import type { InputHistory as InputHistoryType } from '@/types';

export interface InputHistoryDocument extends InputHistoryType, Document {}

const InputHistorySchema: Schema = new Schema(
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
    topic: {
      type: String,
      required: [true, '输入主题不能为空'],
      trim: true,
      minlength: [1, '输入主题至少1个字符'],
      maxlength: [200, '输入主题不能超过200个字符'],
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
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

InputHistorySchema.index({ userId: 1, topic: 'text' });
InputHistorySchema.index({ userId: 1, courseId: 1 });
InputHistorySchema.index({ userId: 1, createdAt: -1 });

InputHistorySchema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true,
  select: 'name color',
});

export default mongoose.model<InputHistoryDocument>('InputHistory', InputHistorySchema);