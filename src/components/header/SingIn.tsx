// import { JWTPayload } from "@/lib/utils";
// import { Settings, UserPlus } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import React from "react";
// import LogoutButton from "./LogoutButton";
// import { signOut, useSession } from "next-auth/react";
// import { Button } from "../ui/button";
// import { FaUserTimes } from "react-icons/fa";


// const SingIn = ({ payload }: { payload: JWTPayload }) => {

//   const { data: session } = useSession();
//   console.log("🧠 Session:", session);
//   return (
//     <>
//       <div className="flex flex-col  justify-center">
//         <Image
//           src={"/login_dark_mode.jpeg"}
//           alt="user image"
//           width={"80"}
//           height={"80"}
//           className="rounded-full m-auto mb-4"
//         />
//         <span className="font-bold">My Accont</span>
//         {/* <span className="font-bold text-center">{payload && payload.username}</span> */}
//         <span className="text-center">{payload?.email || session?.user?.email || ""}</span>

//         <div className="-mx-1 my-4 h-px bg-muted" />

//         <div className="flex items-center justify-between space-x-2">
//           <div >
//             {!payload || !session ? <div className="bg-slate-800 p-2 rounded-lg">
//               <Link href={"/login"}>
//                 sign in <UserPlus className="inline-flex" />
//               </Link>
//             </div> : <>{session ?
//               <Button
//                 onClick={() => signOut({ callbackUrl: `/login` })}
//                 className="flex gap-2 items-center justify-between w-full bg-transparent p-2 font-semibold"
//               >
//                 Sign out
//                 <FaUserTimes className="w-6 h-6" />
//               </Button> : <LogoutButton />}</>}
//           </div>
//           <div className="bg-slate-800 p-2 rounded-lg">
//             <Link href={"/profile"}>
//               <Settings className="w-4 h-4 md:w-5 md:h-5" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SingIn;


"use client";

import { JWTPayload } from "@/lib/utils";
import { FileSliders, Settings, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { FaUserTimes } from "react-icons/fa";
import LogoutButton from "./LogoutButton";

const SingIn = ({ payload }: { payload: JWTPayload }) => {
  const { data: session } = useSession();



  return (
    <div className="flex flex-col justify-center">
      <Image
        src="/login_dark_mode.jpeg"
        alt="user image"
        width={"80"}
        height={"80"}
        className="rounded-full m-auto mb-4 sm:w-20 sm:h-20 w-16 h-16"
      />

      <span className="font-bold md:text-lg text-[0.8rem]">My Account</span>
      <span className="text-center md:text-lg text-[0.7rem]">
        {payload?.email || session?.user?.email || ""}<span>
          {payload?.isAdmin && (
            <Image
              src="/verify-admin.png"
              alt="verify-admin"
              width={25}
              height={25}
              className="inline-flex ml-1"
            />
          )}
        </span>
      </span>

      <div className="-mx-1 my-4 h-px bg-muted" />

      <div className="flex flex-col-reverse items-center justify-between sm:space-x-2 sm:flex-row gap-2">
        <div >
          {payload || session ? (
            <>{session ? <Button
              onClick={() => signOut({ callbackUrl: `/login` })}
              variant="destructive"
            >
              Sign out
              <FaUserTimes className="w-6 h-6" />
            </Button> : <LogoutButton />}</>
          ) : (<Link href={"/login"} >
            <Button className="text-white"> sign in <UserPlus className="inline-flex" /></Button>
          </Link>

          )}
        </div>

        <div className="flex items-center space-x-2">
          {payload?.isAdmin &&
            <Link href="/dashboard" className="p-2 text-sm rounded-lg bg-slate-800">
              dashboard
              <FileSliders className="w-4 h-4 md:w-5 md:h-5 inline-flex ml-2" />
            </Link>}

          <Link href="/profile" className="p-2 rounded-lg bg-slate-800">
            <Settings className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingIn;


