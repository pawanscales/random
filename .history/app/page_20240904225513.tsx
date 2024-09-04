"use client";

import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CredentialsForm } from "@/components/credentialsForm";
import { GoogleSignInButton, GithubSignInButton } from "@/components/authButtons";

const SignInPage: React.FC = async () => {
  const session = await getServerSession(authConfig);

  if (session) {
    redirect("/page-1");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full">
      <div className="flex flex-col items-center p-10 mt-10 shadow-md">
        <h1 className="text-4xl font-bold mb-4">Sign In</h1>
        <GoogleSignInButton />
        <GithubSignInButton />
        <span className="text-2xl font-semibold text-white text-center mt-8">Or</span>
        <CredentialsForm />
      </div>
    </div>
  );
};

export default SignInPage;
