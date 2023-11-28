'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams
} from './shared.types';
import Tag, { ITag } from '@/database/tag.model';
import Question from '@/database/question.model';
import { FilterQuery } from 'mongoose';

export async function getTopInteractedTags(
  params: GetTopInteractedTagsParams
) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error('❌🔍 User not found 🔍❌');
    }

    /**
     * Find interactions for the user and group by tags
     *
     */
    // TODO: Interactions...

    // Mock tags
    return [
      {
        _id: '1',
        name: 'tag'
      },
      {
        _id: '2',
        name: 'tag2'
      }
    ];
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter } = params;

    /**
     * Query
     */
    const query: FilterQuery<typeof Tag> = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }];
    }

    /**
     * Sorting
     */
    let sortOptions = {};
    switch (filter) {
      case 'popular':
        sortOptions = { questions: -1 };
        break;

      case 'recent':
        sortOptions = { createdOn: -1 };
        break;

      case 'name':
        sortOptions = { name: 1 };
        break;

      case 'old':
        sortOptions = { createdOn: 1 };
        break;

      default:
        break;
    }

    const tags = await Tag.find(query).sort(sortOptions);

    return { tags };
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function getQuestionsByTagId(
  params: GetQuestionsByTagIdParams
) {
  try {
    connectToDatabase();
    const {
      tagId,
      // page = 1,
      // pageSize = 10,
      searchQuery
    } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: 'i' } }
        : {},
      options: {
        sort: { createdAt: -1 }
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' }
      ]
    });

    if (!tag) {
      throw new Error('❌🔍 Tag not found 🔍❌');
    }

    const questions = tag.questions;

    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function getTopPopularTags() {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      {
        // $project is used to reshape how to see tag and what
        // will get back. In this case name and then specify
        // each tag is going to have a number of questions proprety
        // that is going to be a size of the questions.
        // So that's going to be the number of questions
        // related to each tags
        $project: { name: 1, numberOfQuestions: { $size: '$questions' } }
      },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 }
    ]);

    return popularTags;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}
