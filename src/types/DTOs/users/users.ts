import { User } from "@/db/migrations/schema";

export type InsertUser = Omit<User, "id" | "key" >;
export type UpdateUser = Omit<User, "id" | "key" >;

export type UserFilters = {
  userName?: string;
  name?: string;
  lastName?: string;
};