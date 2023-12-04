'use server';

import Answer from '@/database/answer.model';
import { connectToDatabase } from '../mongoose';
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams
} from './shared.types';
import Question from '@/database/question.model';
import Interaction from '@/database/interaction.model';
import { revalidatePath } from 'next/cache';
import User from '@/database/user.model';

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({ content, author, question });

    // Add the answer to the question's answers array
    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id }
    });

    // Increment user reputation
    await Interaction.create({
      user: author,
      action: 'answer',
      question,
      answer: newAnswer.id,
      tags: questionObject.tags
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();
    const { questionId, sortBy, page = 1, pageSize = 10 } = params;

    // for Pagination => caluclate the number of posts to skip based on the pageNumber and pageSize
    const skipAmount = (page - 1) * pageSize;

    /**
     * Sorting
     */
    let sortOptions = {};
    switch (sortBy) {
      case 'higestUpvotes':
        sortOptions = { upvotes: -1 };
        break;

      case 'lowestUpvotes':
        sortOptions = { upvotes: 1 };
        break;

      case 'recent':
        sortOptions = { createdAt: -1 };
        break;

      case 'old':
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate('author', '_id clerkId name picture')
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    /**
     * Pagination
     */
    const totalAnswers = await Answer.countDocuments({
      question: questionId
    });
    const isNext = totalAnswers > skipAmount + answers.length;

    return { answers, isNext };
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;

    let updateQuery = {};

    if (hasUpvoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasDownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId }
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true
    });

    if (!answer) {
      throw new Error(`❌ Answer not found ❌`);
    }

    // Increment author's reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpvoted ? -2 : 2 }
    });

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasUpvoted ? -10 : 10 }
    });

    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;

    let updateQuery = {};

    if (hasDownvoted) {
      updateQuery = { $pull: { downvoteAnswer: userId } };
    } else if (hasUpvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId }
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true
    });

    if (!answer) {
      throw new Error(`❌ Answer not found ❌`);
    }

    // Decrement author's reputation
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownvoted ? -2 : 2 }
    });

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasDownvoted ? -10 : 10 }
    });

    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase();

    const { answerId, path } = params;

    // Find the answer
    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error(`❌ Answer not found ❌`);
    }

    // Delete the answer
    await answer.deleteOne({ _id: answerId });

    // Update all question that include the answer
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );

    // Delete all interaction relative to the answer
    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}
