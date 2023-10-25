/**
 *  all of server actions for the question model
 *
 */

'use server';

import { connectToDatabase } from '../mongoose';
import Question from '@/database/question.model';
import Tag from '@/database/tag.model';

export async function createQuestion(params) {
  // eslint-disable-next-line no-empty
  try {
    // connect to DB
    connectToDatabase();

    // Accepr some parameteres form the front end
    // everything that we pass from our form.
    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author
    });

    const tagDocuments = [];

    /**
     * Find an existing Tag or create a new one, and
     * associate it with a question.
     *
     * This function performs a search for a Tag
     * with the specified name, and if it doesn't exist,
     * it creates a new Tag with that name and associates
     * it with the provided question.
     *
     */
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, 'i') } }, // find something
        { $setOnInsert: { name: tag }, $push: { question: question._id } }, // do something on it
        { upsert: true, new: true } // additional options
      );

      tagDocuments.push(existingTag._id);
    }

    // Update the question
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } }
    });

    // Create an interaction recrod for the user's
    // ask_question action

    // Increment author's reputation by +5 points because
    // he created a question
  } catch (error) {}
}
