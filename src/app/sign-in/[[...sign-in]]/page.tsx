import type { Metadata } from "next";
import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerkAppearance";

export const metadata: Metadata = {
  title: "Sign In — The Kicks Lab",
};

export default function SignInPage() {
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
        <SignIn
          appearance={clerkAppearance}
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/"
        />
      </div>
    </div>
  );
}
