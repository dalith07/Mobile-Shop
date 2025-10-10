import { getUser } from '@/apiCalls/usersApiCall';
import ProfileUser from './ProfileUser';
import { cookies } from 'next/headers';
import { verifyTokenFroPage } from '@/lib/verifyToken';

interface PageProps {
    params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
    const token = (await cookies()).get("jwtToken")?.value || "";
    const payload = verifyTokenFroPage(token);

    const user = await getUser((await params).id);
    console.log(user.id)
    return (
        <ProfileUser users={user} payload={payload!} />
    )
}

export default page


