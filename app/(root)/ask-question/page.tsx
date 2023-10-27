import Question from '@/components/forms/Question';
import { getUserByID } from '@/lib/actions/user.action';
// import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const AskQuestion = async () => {
  // const { userId } = auth();
  const userId = '123456789'; // dummy user

  if (!userId) redirect('/sign-in');

  const mongoUser = await getUserByID({ userId });

  console.log(`🍃👤 ${mongoUser} 👤🍃`);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
};

export default AskQuestion;
