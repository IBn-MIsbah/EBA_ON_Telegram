import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  role: "USER" | "AMIR" | "AMIRA" | "VICEAMIR" | "VICEAMIRA" | "ADMIN";
  gender: "MALE" | "FEMALE";
  password: string;
  refreshToken: string;
  isActive: boolean;
  telegramUserId?: string;
}
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      maxlength: 13,
      minlength: 10,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["USER", "AMIR", "AMIRA", "VICEAMIR", "VICEAMIRA", "ADMIN"],
      default: "USER",
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      default: "MALE",
    },
    password: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    telegramUserId: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
