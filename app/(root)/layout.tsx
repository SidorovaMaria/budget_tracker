import React from "react";

import MobileNavBar from "@/components/navigation/MobileNavBar";
import LeftSideBar from "@/components/navigation/LeftSideBar";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import OptionsProvider from "./OptionsProvider";

/**
 * AuthLayout is a layout component for authentication-related pages.
 *
 * @remarks
 * - Provides a visually rich, responsive layout with a sidebar illustration and branding for large screens,
 *   and a compact header for mobile devices.
 * - Includes accessibility features such as a skip link for keyboard users.
 * - The main content area is centered and intended to render authentication forms or related content.
 *
 * @param {AuthLayoutProps} props - The props for the AuthLayout component.
 * @param {React.ReactNode} props.children - The content to be rendered within the main authentication area.
 *
 * @returns {JSX.Element} The rendered authentication layout.
 */

const MainLayout = async ({ children }: LayoutProps) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return (
    <OptionsProvider>
      <main className="min-h-screen w-full flex ">
        <LeftSideBar />
        <section
          id="main-content"
          className="flex flex-col w-full px-4 py-6  gap-8
      md:px-10 md:py-8 mb-[52px] md:mb-[74px]"
        >
          {children}
        </section>
        <MobileNavBar />
        {/* <form
        className="fixed top-4 right-4"
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign out</button>
      </form> */}
      </main>
    </OptionsProvider>
  );
};

export default MainLayout;
