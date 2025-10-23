// // src/lib/authOptions.ts
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import type { NextAuthOptions } from "next-auth";
// import { prisma } from "./prisma";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (
//           credentials?.email === "demo@workspare.com" &&
//           credentials?.password === "demo123"
//         ) {
//           return { id: "1", email: credentials.email, name: "Demo User" };
//         }
//         return null;
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },
//   callbacks: {
//     // async jwt({ token, user }) {
//     //   // Only update token on sign-in
//     //   if (user) {
//     //     token.id = user.id;
//     //     token.name = user.name;
//     //     token.email = user.email;
//     //   }
//     //   return token;
//     // },
//     // async session({ session, token }) {
//     //   if (session.user) {
//     //     // session.user.id = token.id as string;
//     //     session.user.name = token.name as string;
//     //     session.user.email = token.email as string;
//     //   }
//     //   return session;
//     // },
//     // async jwt({ token, user }) {
//     //   if (user) {
//     //     // 🧠 Create user in DB if not exists (for Google login)
//     //     const existingUser = await prisma.user.findUnique({
//     //       where: { email: user.email! },
//     //     });

//     //     if (!existingUser) {
//     //       await prisma.user.create({
//     //         data: {
//     //           email: user.email!,
//     //           username: user.name ?? user.email!.split("@")[0],
//     //           password: "", // Google users don’t need passwords
//     //         },
//     //       });
//     //     }

//     //     token.id = existingUser?.id ?? undefined;
//     //     token.name = user.name;
//     //     token.email = user.email;
//     //   }

//     //   return token;
//     // },
//     async jwt({ token, user }) {
//       if (user) {
//         // Find user in DB
//         let dbUser = await prisma.user.findUnique({
//           where: { email: user.email! },
//         });

//         // Create user if not exists
//         if (!dbUser) {
//           dbUser = await prisma.user.create({
//             data: {
//               email: user.email!,
//               username: user.name ?? user.email!.split("@")[0],
//               password: "", // Google users don't need passwords
//               isAdmin: false, // default
//             },
//           });
//         }

//         // Set JWT token
//         token.id = dbUser.id;
//         token.name = dbUser.username;
//         token.email = dbUser.email;
//         token.isAdmin = dbUser.isAdmin;
//       }

//       return token;
//     },
//   },
// };

// // 22

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      isAdmin: boolean;
      image: string;
    };
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isMatch) return null;

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email!,
              username: user.name ?? user.email!.split("@")[0],
              password: "",
              isAdmin: false,
            },
          });
        }

        token.id = dbUser.id;
        token.name = dbUser.username!;
        token.email = dbUser.email;
        token.isAdmin = dbUser.isAdmin;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
};
