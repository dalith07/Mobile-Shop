/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Badge,
  Building2,
  CircleDollarSign,
  Handshake,
  Heart,
  House,
  Mail,
  ShoppingBasket,
  ShoppingCart,
  Store,
  X,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Link from "next/link";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { useCart } from "@/lib/cart_context";

interface setOpenNavMobileProps {
  setOpenNavMobile: Dispatch<SetStateAction<boolean>>;
}

const MobileNav = ({ setOpenNavMobile }: setOpenNavMobileProps) => {

  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenNavMobile(false);
      }
    };
    document.addEventListener("keydown", handler); // Remove the arrow function wrapper

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  const navRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(navRef, () => {
    setOpenNavMobile(false);
  });
  return (
    <>
      {/* <div className="fixed inset-0 z-50 bg-red-400"></div> */}
      <div
        className="fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out inset-y-0 left-0 border-r sm:max-w-sm w-[70%] h-screen"
        ref={navRef}
      >
        {/* NAV LINKS LOGO AND NAME WEB SITE  */}
        <div className="flex items-center justify-center gap-6">
          <Link href="/">
            <div
              className="h-full xl:right-0 sm:items-center"
              style={{ width: "60px", height: "60px" }}
            >
              <Image
                src={"/logo_mobile.png"}
                alt="logo"
                width={"1000"}
                height={"1000"}
              />
            </div>
          </Link>

          <div className="text-sm  font-semibold">
            <Link href="/">
              <p>Mobile</p>
              <p>Store</p>
            </Link>
          </div>
        </div>

        <div className="shrink-0 bg-border h-[1px] w-full my-4" />

        {/* NAV LINKS  */}
        <div className="flex flex-col space-y-2">
          <Link href="/">
            <div
              className="group text-sm border w-full rounded-xl flex items-center justify-center p-2 cursor-pointer
          bg-slate-100 dark:bg-slate-600/30 hover:bg-slate-200 dark:hover:bg-slate-600/50"
            >
              <House className="w-4 h-4 mr-1 group-hover:text-blue-500" />
              <span className="group-hover:text-blue-500">Home</span>
            </div>
          </Link>

          <Link href="/MarketPlace">
            <div
              className="group text-sm border w-full rounded-xl flex items-center justify-center p-2 cursor-pointer
          bg-slate-100 dark:bg-slate-600/30 hover:bg-slate-200 dark:hover:bg-slate-600/50"
            >
              <Store className="w-4 h-4 mr-1 group-hover:text-yellow-500" />
              <span className="group-hover:text-yellow-600">MarketPlace</span>
            </div>
          </Link>

          <Link href="/MarketPlace/BestSelling">
            <div
              className="group text-sm border w-full rounded-xl flex items-center justify-center p-2 cursor-pointer
          bg-slate-100 dark:bg-slate-600/30 hover:bg-slate-200 dark:hover:bg-slate-600/50"
            >
              <CircleDollarSign className="w-4 h-4 mr-1 group-hover:text-green-500" />
              <span className="group-hover:text-green-600">Beast Selling</span>
            </div>
          </Link>

          <Link href="/Service">
            <div
              className="group text-sm border w-full rounded-xl flex items-center justify-center p-2 cursor-pointer
          bg-slate-100 dark:bg-slate-600/30 hover:bg-slate-200 dark:hover:bg-slate-600/50"
            >
              <Handshake className="w-4 h-4 mr-1 group-hover:text-purple-500" />
              <span className="group-hover:text-purple-500">Services</span>
            </div>
          </Link>
        </div>

        <div className="shrink-0 bg-border h-[1px] w-full my-4" />

        {/* NAV LINKS FAVE LIST AND CART AND YOUR ORDERS */}
        <div className="flex flex-col space-y-2">
          <Link href="/FaveList">
            <div
              className="group text-sm relative border w-full rounded-xl flex items-center justify-center p-2 cursor-pointer
    bg-slate-100 dark:bg-slate-600/30 hover:bg-slate-200 dark:hover:bg-slate-600/50"
            >
              <Heart className="w-4 h-4 mr-1 group-hover:text-red-500" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                0
              </span>
              <span className="group-hover:text-red-600">Fave List</span>
            </div>
          </Link>

          <Link href="/Cart">
            <div
              className="group text-sm border relative w-full rounded-xl flex items-center justify-center p-2 cursor-pointer
    bg-slate-100 dark:bg-slate-600/30 hover:bg-slate-200 dark:hover:bg-slate-600/50"
            >
              <ShoppingCart className="w-4 h-4 mr-1 group-hover:text-blue-500" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                {totalItems > 0 && (
                  <Badge>
                    {totalItems}
                  </Badge>
                )}
              </span>
              <span className="group-hover:text-blue-600">Cart</span>
            </div>
          </Link>

          <Link href="/YourOrders">
            <div
              className="group text-sm border relative w-full rounded-xl flex items-center justify-center p-2 cursor-pointer
    bg-slate-100 dark:bg-slate-600/30 hover:bg-slate-200 dark:hover:bg-slate-600/50"
            >
              <ShoppingBasket className="w-4 h-4 mr-1 group-hover:text-green-500" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full text-xs w-5 h-4 flex items-center justify-center">
                0
              </span>
              <span className="group-hover:text-green-500">Your Orders</span>
            </div>
          </Link>
        </div>

        <div className="shrink-0 bg-border h-[1px] w-full my-4" />

        {/* NAV LINKS ABOUT US AND CONTACT */}
        <div className="flex flex-col space-y-2">
          <Link href="/about">
            <div
              className="group text-sm border w-full rounded-xl flex items-center justify-center p-2 cursor-pointer
    bg-slate-100 dark:bg-slate-600/30 hover:bg-slate-200 dark:hover:bg-slate-600/50"
            >
              <Building2 className="w-4 h-4 mr-1 group-hover:text-blue-500" />
              <span className="group-hover:text-blue-500">About Us</span>
            </div>
          </Link>

          <Link href="/contact">
            <div
              className="group text-sm border w-full rounded-xl flex items-center justify-center p-2 cursor-pointer
    bg-slate-100 dark:bg-slate-600/30 hover:bg-slate-200 dark:hover:bg-slate-600/50"
            >
              <Mail className="w-4 h-4 mr-1 group-hover:text-red-500" />
              <span className="group-hover:text-red-500">Contact</span>
            </div>
          </Link>
        </div>

        <div className="shrink-0 bg-border h-[1px] w-full my-4" />

        {/* NAV LINKS SOCIAL MEDIA */}
        <div className="flex justify-center items-center">
          <div className="text-muted-foreground text-sm font-semibold flex flex-col sm:flex-row items-center justify-center gap-2">
            Social Media:
            <div className="flex gap-3 mb-1">
              <div className="border-1 rounded-full bg-white">
                <FaFacebook className="w-7 h-7 cursor-pointer hover:text-blue-600 text-blue-600" />
              </div>

              <div className="border-1 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
                <FaInstagram className="w-7 h-7 cursor-pointer text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* CLOSE MENU */}
        <button
          onClick={() => setOpenNavMobile(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
};

export default MobileNav;
