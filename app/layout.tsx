import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth, signOut } from "@/auth";
import { Toaster } from "sonner";
import MobileNavBar from "@/components/navigation/MobileNavBar";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Finance - personal budget tracker",
  description:
    "A simple personal budget tracker app to manage your finances effectively. Track income, expenses, and savings all in one place, with great UI and easy-to-use features.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Finance - personal budget tracker",
    description:
      "A simple personal budget tracker app to manage your finances effectively. Track income, expenses, and savings all in one place, with great UI and easy-to-use features.",
    url: "TODO: add url",
    siteName: "Finance - personal budget tracker",
    images: [
      {
        url: "TODO: add image url",
        width: 800,
        height: 600,
      },
      {
        url: "TODO: add image url",
        width: 1800,
        height: 1600,
        alt: "Og Image Alt",
      },
    ],
    locale: "en_UK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance - personal budget tracker",
    description:
      "A simple personal budget tracker app to manage your finances effectively. Track income, expenses, and savings all in one place, with great UI and easy-to-use features.",
    images: ["TODO: add image url"],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  //Populate USer

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <SessionProvider session={session}>
        <body className={` ${publicSans.variable} antialiased bg-beige-100`}>
          {children}
          <MobileNavBar />
          <Toaster />
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="absolute bottom-4 right-4"
          >
            <button type="submit" className="base-medium w-fit !bg-transparent px-4 py-3">
              <span className="btn btn-primary">Logout</span>
            </button>
          </form>
        </body>
      </SessionProvider>
    </html>
  );
}
