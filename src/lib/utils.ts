import {
  Category,
  Image,
  Model,
  Products,
  Profile,
  User,
} from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ProfileWithUser = User & { Profile: Profile };

export type ProductnWithImages = Products & {
  images: Image[];
};

export type ProductsWithAll = Products & {
  images: Image[];
  category: Category;
  model: Model;
};

export type JWTPayload = {
  id: string;
  isAdmin: boolean;
  username: string;
  email: string;
};

export const countries = [
  { name: "Nigeria", continent: "Africa", code: "NG", image: "/Nigeria.svg" },
  {
    name: "Tunisia",
    continent: "Africa",
    code: "TN",
    image: "/tunisiac.svg",
  },
  { name: "Algeria", continent: "Africa", code: "DZ", image: "/algerie.svg" },
  { name: "Marooco", continent: "Africa", code: "MC", image: "/morocco.svg" },
  { name: "Japan", continent: "Asia", code: "JP", image: "/japan.svg" },
  {
    name: "Germany",
    continent: "Europe",
    code: "DE",
    image: "/germanyc.svg",
  },
  {
    name: "Canada",
    continent: "North America",
    code: "CA",
    image: "/canada.svg",
  },
  {
    name: "Brazil",
    continent: "South America",
    code: "BR",
    image: "/Brazil.png",
  },
  {
    name: "Australia",
    continent: "Oceania",
    code: "AU",
    image: "/Australia.jpeg",
  },
  {
    name: "United States",
    continent: "Oceania",
    code: "USA",
    image: "/united-states.svg",
  },
  {
    name: "France",
    continent: "Oceania",
    code: "FR",
    image: "/france.svg",
  },
];
