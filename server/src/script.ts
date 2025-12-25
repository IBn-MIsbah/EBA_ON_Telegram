import bcrypt from "bcryptjs";
import { User } from "./models/User.js";
import dbConnection from "./config/dbConfig.js";

dbConnection();

const userToSeed = [
  {
    name: "Super Admin",
    email: "admin@eba.com",
    role: "ADMIN",
    gender: "MALE",
    password: "admin",
    phone: "0987654321",
  },
  {
    name: "Amir",
    email: "amir@eba.com",
    role: "AMIR",
    gender: "MALE",
    password: "amir",
    phone: "0912876767",
  },
  {
    name: "Amira",
    email: "amira@eba.com",
    role: "AMIRA",
    gender: "FEMALE",
    password: "amira",
    phone: "0987333344",
  },
];
const registerUser = async () => {
  console.log("seeding start");

  for (const u of userToSeed) {
    try {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`User ${u.email} already exists, skipping...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(u.password, 10);

      await User.create({
        ...u, // Spread the individual user, not the whole array
        password: hashedPassword,
      });

      console.log(`Created user: ${u.name} (${u.role})`);
    } catch (error) {
      console.error(`Error creating user ${u.email}:`, error);
    }
  }
};

registerUser()
  .then(() => {
    console.log("Seeding completed!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Critical failure: ", err);
    process.exit(1);
  });
