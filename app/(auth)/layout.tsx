import Image from "next/image";
import Link from "next/link";
import React from "react";

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

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* Skip Link for keyboard users */}
      <a
        href="#authentication"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-white/90 focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Skip to the Authentication
      </a>
      <div
        role="complementary"
        className="w-screen min-h-dvh bg-grey-300 lg:grid lg:grid-cols-[600px_1fr]"
      >
        {/* Mobile Header */}
        <header className="fixed top-0 z-40 bg-grey-900 px-10 py-6 rounded-b-lg flex items-center justify-center shadow-md w-full lg:hidden">
          <Link href="/" className="relative block w-[295px] h-[22px]" aria-label="Go to homepage">
            <Image src="./logo/logo-large.svg" alt="Logo" fill />
          </Link>
        </header>
        <aside className="p-5 h-full w-full hidden lg:block ">
          <div className="relative w-full h-full rounded-xl overflow-hidden ">
            <Image
              src="./images/illustration-authentication.svg"
              // Only for illustration purposes
              alt=""
              aria-hidden="true"
              fill
              sizes="600px"
              priority
              className="object-cover rounded-xl"
            />
            {/* Contrast Overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10"
            />
            {/* Logo Desktop */}
            <Link
              href="/"
              aria-label="Go to homepage"
              className="absolute top-10 left-10  w-[121px] h-[22px]"
            >
              <Image src="./logo/logo-large.svg" alt="Logo" fill sizes="121px" priority />
            </Link>
            {/* Text */}
            <div className="absolute bottom-10 left-10 max-w-md text-white space-y-6">
              <h1>Keep track of your money and save for your future</h1>
              <p className="four">
                Personal finance app puts you in control of your spending. Track transactions, set
                budgets, and add to savings pots easily.
              </p>
            </div>
          </div>
        </aside>
        <main
          id="authentication"
          tabIndex={-1}
          className="w-full min-h-dvh flex items-center justify-center px-4 md:max-w-[560px] md:mx-auto "
        >
          {children}
        </main>
      </div>
    </>
  );
};

export default AuthLayout;
