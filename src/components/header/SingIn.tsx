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
  const isAdmin = payload?.isAdmin || session?.user?.isAdmin;

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

      <div className="flex flex-row items-center justify-between gap-2">
        <div >
          {payload || session ? (
            <>{session ? <Button
              onClick={() => signOut({ callbackUrl: "/login", redirect: true })}
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
        {/* <div className="flex items-center space-x-2">
          {isAdmin &&
            <Link href="/dashboard" className="flex flex-row gap-2 p-2 rounded-lg bg-slate-800">
              dashboard
              <FileSliders className="w-4 h-4 md:w-5 md:h-5 inline-flex ml-2" />
            </Link>}

          <Link href="/profile" className="p-2 rounded-lg bg-slate-800">
            <Settings className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div> */}

        <div >
          <Link href="/profile" className="flex items-center  gap-2 p-2 rounded-lg bg-slate-800">
            Settings <Settings className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>
      </div>

      <div className="mt-4 mb-2 flex justify-center">
        {isAdmin &&
          <Link href="/dashboard" className="flex flex-row gap-2 p-2 rounded-lg bg-slate-800">
            dashboard
            <FileSliders className="w-4 h-4 md:w-5 md:h-5 inline-flex ml-2" />
          </Link>
        }
      </div>


    </div>
  );
};

export default SingIn;


