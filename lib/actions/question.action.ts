/**
 *  all of server actions for the question model
 *
 */

'use server';

import { connectToDatabase } from '../mongoose';

export async function createQuestion(params) {
  // eslint-disable-next-line no-empty
  try {
    // connect to DB
    connectToDatabase();
  } catch (error) {}
}
