'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  UpdateUserParams
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';

export async function getUserByID(params: any) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error('🔎 User not found');
    }

    /**
     *  Delete user from database
     *  It means questions, answers, commnets, etc
     *
     */
    // get user question ids

    // ?  const userQuestionIds = await Question.find({
    // ?    author: user._id
    // ?  }).distinct('_id');

    // ⬆️ distinct | create a distinct query, meaning return
    // distinct values of the given field that mathces this filter

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc

    // delete user
    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    /**
     * All users newest on the top
     */
    const users = await User.find({}).sort({ createdAt: -1 });

    return { users };
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}
