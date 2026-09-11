import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { loginSchema } from "@/lib/validations";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8 hour admin sessions
  pages: { signIn: "/admin/login" },
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const [user] = await db
          .select()
          .from(adminUsers)
          .where(eq(adminUsers.email, email.toLowerCase().trim()))
          .limit(1);

        if (!user || !user.isActive) return null;

        // Account temporarily locked from repeated failed attempts.
        if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
          return null;
        }

        const passwordOk = await bcrypt.compare(password, user.passwordHash);

        if (!passwordOk) {
          const attempts = user.failedLoginAttempts + 1;
          const shouldLock = attempts >= MAX_FAILED_ATTEMPTS;
          await db
            .update(adminUsers)
            .set({
              failedLoginAttempts: shouldLock ? 0 : attempts,
              lockedUntil: shouldLock
                ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000)
                : user.lockedUntil,
            })
            .where(eq(adminUsers.id, user.id));
          return null;
        }

        // Successful login — reset the failure counter.
        await db
          .update(adminUsers)
          .set({ failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() })
          .where(eq(adminUsers.id, user.id));

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: user.permissions,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = (user as { id: string }).id;
        token.permissions = (user as { permissions: string[] }).permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
  },
});
