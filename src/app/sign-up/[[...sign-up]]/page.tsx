import type { Metadata } from "next";
import Image from "next/image";
import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerkAppearance";

export const metadata: Metadata = {
  title: "Sign Up — The Kicks Lab",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <Image
          src="/assets/main-logo.png"
          alt="The Kicks Lab"
          width={160}
          height={42}
          className="mx-auto mb-6 h-10 w-auto"
          priority
        />
        <SignUp
          appearance={clerkAppearance}
          signInUrl="/sign-in"
          fallbackRedirectUrl="/"
        />
      </div>
    </div>
  );
}
