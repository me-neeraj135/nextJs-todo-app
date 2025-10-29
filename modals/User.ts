import { Db } from "mongodb";
import { User } from "@/types/user";

// Collection name for Users
export const USER_COLLECTION = "users";

// MongoDB indexes configuration
// Helper functions for User collection
// Keep indexes simple: ensure email is unique.
export async function createUserIndexes(db: Db) {
  const users = db.collection(USER_COLLECTION);
  // create a unique index on email (idempotent)
  await users.createIndex({ email: 1 }, { unique: true });
}









// Validation functions
export function validateUser(user: Partial<User>): void {
  if (!user.email) throw new Error("Email is required");
  if (!user.name) throw new Error("Name is required");
  if (!user.password) throw new Error("Password is required");
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    throw new Error("Invalid email format");
  }

  // Name validation
  if (user.name.length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }

  // Password validation
  if (user.password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
}