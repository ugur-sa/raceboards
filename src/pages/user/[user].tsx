import { useRouter } from 'next/router';

const UserPage = () => {
  const router = useRouter();
  const { user } = router.query;

  return (
    <div>
      <h1>User: {user}</h1>
    </div>
  );
};

export default UserPage;
