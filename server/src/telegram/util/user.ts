import { User } from "../../models/User.js";

interface UserObj {
  name: string;
  phone: string;
  telegramUserId: string;
}

/**
 * Creates or finds a user by Telegram user ID
 * @param user - object containing {name, phone, telegramUserId}
 * @returns User document or null on failure
 * @throws Error if creation fails unexpectedly
 */
export const createUser = async ({ name, phone, telegramUserId }: UserObj) => {
  try {
    const existingUser = await User.findOne({ telegramUserId });
    if (existingUser) return existingUser;

    const newUser = await User.create({
      name,
      phone,
      telegramUserId,
    });

    return newUser;
  } catch (error) {
    console.error("User registration failed:", error);
    throw new Error(
      `Failed to create user: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
