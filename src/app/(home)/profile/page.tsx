import React from 'react'
import ProfilePage from './ProfilePage'
import { cookies } from 'next/headers';
import { verifyTokenFroPage } from '@/lib/verifyToken';

const page = async () => {
    const token = (await cookies()).get("jwtToken")?.value || "";
    const payload = verifyTokenFroPage(token);
    return (
        <div>
            <ProfilePage payload={payload!} />
        </div>
    )
}

export default page
