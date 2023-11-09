import Profile from '@/components/forms/Profile';
import { getUserByID } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs';

const EditProfile = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserByID({ userId });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 ">Edit Profile</h1>

      <div className="mt-9">
        <Profile
          clerkId={userId}
          user={JSON.stringify(mongoUser)} // ? <- Pass in this way (with stringify) because it is a client component and it not accept complex object from MongoDB
        />
      </div>
    </>
  );
};
export default EditProfile;
