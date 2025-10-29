import { ObjectId } from "mongodb";

// Base model interface with common fields
interface BaseModel {
  _id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// User interfaces
export interface User extends BaseModel {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  avatar?: string;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

// Post interfaces
export interface Post extends BaseModel {
  title: string;
  content: string;
  slug: string;
  authorId: ObjectId;
  published: boolean;
  tags?: string[];
}

// Comment interfaces
export interface Comment extends BaseModel {
  content: string;
  postId: ObjectId;
  authorId: ObjectId;
  parentId?: ObjectId;
}
