"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  House,
  Menu,
  ShoppingBasket,
  ShoppingCart,
  Store,
  Moon,
  Sun,
  Handshake,
  Badge,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import MobileNav from "./MobileNav";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import SingIn from "./header/SingIn";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { JWTPayload } from "@/lib/utils";
import { useCart } from "@/lib/cart_context";

const NavBarHeader = ({ payload }: { payload: JWTPayload }) => {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  const [openNavMobile, setOpenNavMobile] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenNavMobile(false);
        setOpenSignIn(false);
      }
    };
    document.addEventListener("keydown", handler); // Remove the arrow function wrapper

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  // const navRef = useRef<HTMLDivElement | null>(null);

  const navRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(navRef, () => {
    setOpenNavMobile(false);
    setOpenSignIn(false);
  });

  return (
    <nav
      className="sticky z-[50] h-14 inset-x-0 top-0 w-full  backdrop-blur-lg transition-all"
      ref={navRef}
    >
      <div className="h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
        {/* MIDIAQURY DESTUP LG:1024 */}
        <div className="lg:flex hidden h-14 items-center justify-between space-x-2">
          {/* LOGO */}
          <Link href={"/"}>
            <div className="h-full xl:right-0 sm:items-center">
              <Image
                src={"/logo_mobile.png"}
                alt="logo"
                width={"80"}
                height={"80"}
                className=""
              />
            </div>
          </Link>

          {/* LINKS NAV BAR */}
          <div className="flex h-full left-0 items-center lg:space-x-4 xl:space-x-8">
            <Link
              href="/"
              className={clsx(
                "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs",
                pathname === "/"
                  ? "text-blue-500"
                  : "hover:bg-accent hover:text-blue-500"
              )}
            >
              <House className="mr-1 w-5 h-5" />
              Home
            </Link>

            <Link
              href="/MarketPlace"
              className={clsx(
                "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs",
                pathname === "/MarketPlace"
                  ? "text-yellow-500"
                  : "hover:bg-accent hover:text-yellow-500"
              )}
            >
              <Store className="mr-1 w-5 h-5" />
              MarketPlace
            </Link>

            <Link
              href="/Service"
              className={clsx(
                "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 rounded-md px-3 text-xs",
                pathname === "/Service"
                  ? "text-purple-500"
                  : "hover:bg-accent hover:text-purple-500"
              )}
            >
              <Handshake className="mr-1 w-5 h-5" />
              Service
            </Link>
            <div className="h-8 w-px bg-zinc-200 hidden sm:block"></div>

            <Link
              href="/FavList"
              className={clsx(
                "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-8 rounded-md px-3 text-xs relative hover:text-red-500",
                pathname === "/FavList"
                  ? "text-red-500"
                  : "hover:bg-accent hover:text-red-500"
              )}
            >
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                0
              </span>
              <Heart className="mr-1 w-5 h-5" />
              Fav List
            </Link>

            <Link
              href={"/Cart"}
              className={clsx(
                "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-8 rounded-md px-3 text-xs relative hover:text-blue-500",
                pathname === "/Cart"
                  ? "text-blue-500"
                  : "hover:bg-accent hover:text-blue-500"
              )}
            >
              <ShoppingCart className="mr-1 w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                {totalItems > 0 ? <>{totalItems}</> : <>0</>}
              </span>
              Cart
            </Link>

            <Link
              href={"/orders"}
              className={clsx(
                "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-8 rounded-md px-3 text-xs relative hover:text-green-500",
                pathname === "/orders"
                  ? "text-green-500"
                  : "hover:bg-accent hover:text-green-500"
              )}
            >
              <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                0
              </span>
              <ShoppingBasket className="mr-1 w-5 h-5" />
              Your Ordres
            </Link>
          </div>

          {/* ICON SIGN IN AND MODE DAR */}
          <div className="flex items-center space-x-2">
            <div
              className="relative"
              onClick={() => setOpenSignIn((prev) => !prev)}
            >
              <Image
                src={"/login_dark_mode.jpeg"}
                alt="user login"
                width={"40"}
                height={"40"}
                className="rounded-full hover:cursor-pointer"
              />

              {openSignIn && (
                <div className="fixed z-50 top-14 right-8 p-2 dark:bg-[#020817] bg-white w-[25%] border dark:border-slate-800 border-gray-200">
                  <SingIn payload={payload} />
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 group border rounded-full">
              <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:rotate-180 group-hover:text-yellow-400" />

              <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:rotate-45 group-hover:text-slate-600" />
            </button>  */}
          </div>
        </div>

        {/* MIDIAQURY MOBILE -LG:1024 */}
        <div className="flex lg:hidden h-14 items-center justify-between">
          <div className="flex justify-start items-start">
            <button
              type="button"
              onClick={() => setOpenNavMobile((prev) => !prev)}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9 shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href={"/FavList"}
              className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-8 rounded-md px-3 text-xs relative hover:text-red-500"
            >
              <Heart className="mr-1" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                0
              </span>
            </Link>

            <Link
              href={"/Cart"}
              className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-8 rounded-md px-3 text-xs relative hover:text-blue-500"
            >
              <ShoppingCart className="mr-1" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                {totalItems > 0 && (
                  <Badge>
                    {totalItems}
                  </Badge>
                )}
              </span>
            </Link>

            <Link
              href={"/YourOrders"}
              className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-8 rounded-md px-3 text-xs relative hover:text-green-500"
            >
              <ShoppingBasket className="mr-1" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className="relative"
              onClick={() => setOpenSignIn((prev) => !prev)}
            >
              <Image
                src={"/login_dark_mode.jpeg"}
                alt="user login"
                width={"40"}
                height={"40"}
                className="rounded-full hover:cursor-pointer"
              />

              {openSignIn && (
                <div className="fixed z-50 top-14 sm:right-2 right-0 p-2
                dark:bg-[#020817] bg-white sm:w-[40%] border
                 dark:border-slate-800 border-gray-200">
                  <SingIn payload={payload} />
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {openNavMobile && <MobileNav setOpenNavMobile={setOpenNavMobile} />}
    </nav>
  );
};

export default NavBarHeader;
