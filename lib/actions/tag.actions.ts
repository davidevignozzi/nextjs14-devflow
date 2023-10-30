'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import { GetTopInteractedTagsParams } from './shared.types';

export async function getTopInteractedTags(
  params: GetTopInteractedTagsParams
) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error('🔎 User not found');

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
