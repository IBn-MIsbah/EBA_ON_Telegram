import { UpdateQuery } from "mongoose";
import { IUser, User } from "../../models/User.js";

export class UserService {
  static async findOrCreate(telegramUserId: string, data: UpdateQuery<IUser>) {
    return await User.findOneAndUpdate(
      { telegramUserId },
      { ...data, telegramUserId, role: "USER" },
      { upsert: true, new: true }
    );
  }

  static async updateGender(telegramUserId: string, gender: "MALE" | "FEMALE") {
    return await User.findOneAndUpdate(
      { telegramUserId },
      { gender },
      { new: true }
    );
  }

  static async findByTelegramId(telegramUserId: string) {
    return await User.findOne({ telegramUserId });
  }
}
