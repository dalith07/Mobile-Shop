"use client";
import axios from "axios";
import { DOMAIN } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaUserTimes } from "react-icons/fa";
import { toast } from "sonner";

const LogoutButton = () => {
  const router = useRouter();
  const logoutHandler = async () => {
    try {
      await axios.get(`${DOMAIN}/api/users/logout`);
      toast.success("Log Out Succefulyy")
      router.replace("/login");
      router.refresh();

    } catch (error) {
      toast.warning("Something went wrong");
      console.log(error);
    }
  };

  return (
    <>
      <Button
        onClick={logoutHandler} variant="destructive" className="cursor-pointer text-sm sm:text-md"
      >
        Log Out
        <FaUserTimes className="w-5 h-5" />
      </Button>
    </>
  );
};

export default LogoutButton;
