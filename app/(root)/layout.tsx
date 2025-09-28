import Image from "next/image";
import Link from "next/link";
import React from "react";
import AuthLayout from "../(auth)/layout";
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
      {children}

      <MobileNavBar />
    </main>
  );
};

export default MainLayout;
