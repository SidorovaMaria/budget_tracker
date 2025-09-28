import React from "react";

import MobileNavBar from "@/components/navigation/MobileNavBar";
import LeftSideBar from "@/components/navigation/LeftSideBar";

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

const MainLayout = ({ children }: LayoutProps) => {
  return (
    <main className="min-h-screen w-full flex ">
      <LeftSideBar />
      <section
        id="main-content"
        className="flex flex-col w-full px-4 py-6  gap-8
      md:px-10 md:py-8 "
      >
        {children}
      </section>

      <MobileNavBar />
    </main>
  );
};

export default MainLayout;
