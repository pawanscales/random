
import { GoogleSignInButton, GithubSignInButton, CredentialsSignInButton } from "@/components/SignInButtons";
import cred
export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">Sign In</h1>
      <GoogleSignInButton />
      <GithubSignInButton />
      <CredentialsSignInButton />
      <CredentialsForm />
    </div>
  );
}
