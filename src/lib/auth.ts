import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./mongodb";
import { User } from "@/models/User";
import { DoctorProfile } from "@/models/DoctorProfile";
import { PatientProfile } from "@/models/PatientProfile";
import { UserRole } from "@/types/user";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password");
        }

        await connectToDatabase();
        const user = await User.findOne({
          email: credentials.email.trim().toLowerCase(),
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        if (user.isActive === false) {
          throw new Error("Account has been deactivated. Please contact support.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        let doctorProfile = null;
        let patientProfile = null;

        if (user.role === "DOCTOR") {
          const doc = await DoctorProfile.findOne({ userId: user._id });
          if (doc) doctorProfile = JSON.parse(JSON.stringify(doc));
        } else if (user.role === "PATIENT") {
          const pat = await PatientProfile.findOne({ userId: user._id });
          if (pat) patientProfile = JSON.parse(JSON.stringify(pat));
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          doctorProfile,
          patientProfile,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isActive = user.isActive;
        token.doctorProfile = user.doctorProfile;
        token.patientProfile = user.patientProfile;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isActive = token.isActive;
        session.user.doctorProfile = token.doctorProfile;
        session.user.patientProfile = token.patientProfile;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
