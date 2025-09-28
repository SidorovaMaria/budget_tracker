"use client";
import { NavLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { memo, useMemo } from "react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { REDUCED_MOTION, SPRING_SMOOTH } from "@/constants/motionVariants";

const MobileNavBar = () => {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const transition = useMemo(
    () => (prefersReducedMotion ? REDUCED_MOTION : SPRING_SMOOTH),
    [prefersReducedMotion]
  );
  return (
    <MotionConfig transition={transition}>
      <nav
        aria-label="Mobile Navigation"
        className={`fixed bottom-0 px-4  bg-grey-900  w-full rounded-t-lg flex justify-between items-center md:px-10 lg:hidden z-50  h-[52px] min-h-[52px] md:min-h-[74px] pt-2`}
      >
        <ul className="flex w-full h-full items-stretch justify-between md:gap-[42px]">
          {NavLinks.map((link) => (
            <NavItem key={link.label} {...link} active={pathname === link.href} />
          ))}
        </ul>
      </nav>
    </MotionConfig>
  );
};

export default MobileNavBar;

type NavLinkProps = (typeof NavLinks)[number] & { active: boolean };

const NavItem = memo(function NavItem({ label, Icon, href, active }: NavLinkProps) {
  return (
    <li className=" h-full group flex-1" data-active={active}>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className="flex flex-col gap-1 cursor-pointer items-center w-full h-full rounded-t-lg justify-center  md:max-w-[104px] relative"
      >
        <Icon className="w-6 h-6  text-grey-300 group-data-[active=true]:text-s-green transition duration-300 ease-in-out relative z-20" />
        <p
          className={`hidden md:block five bold text-grey-300
            group-data-[active=true]:text-grey-900 transition duration-300 ease-in-out relative z-20`}
        >
          {label}
        </p>
        {active && (
          <motion.span
            id="underline"
            layoutId="background"
            className="absolute inset-0 h-full w-full bg-white rounded-t-lg z-0
            border-b-4 border-s-green"
          />
        )}
      </Link>
    </li>
  );
});
