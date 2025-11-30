import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { User as UserType } from '@/types';

export interface UserDocument extends UserType, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, '用户名不能为空'],
      unique: true,
      trim: true,
      minlength: [3, '用户名至少3个字符'],
      maxlength: [30, '用户名不能超过30个字符'],
      match: [/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线'],
    },
    email: {
      type: String,
      required: [true, '邮箱不能为空'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        '请输入有效的邮箱地址',
      ],
    },
    password: {
      type: String,
      required: [true, '密码不能为空'],
      minlength: [6, '密码至少6个字符'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'reading', 'kinesthetic'],
      default: 'reading',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

export default mongoose.model<UserDocument>('User', UserSchema);