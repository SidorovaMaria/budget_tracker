import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";

const GoogleProvider = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button className="w-full btn-secondary btn bg-white mt-2 py-3!" onClick={handleGoogleSignIn}>
      <p className="mr-4">Sign In with Google</p>
      <Image
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
        alt="Google Logo"
        width={24}
        height={24}
      />
    </button>
  );
};

export default GoogleProvider;
