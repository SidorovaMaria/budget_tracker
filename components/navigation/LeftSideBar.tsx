"use client";
import React, { memo, useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import Image from "next/image";
import { NavLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Link from "next/link";
import IconMinimizeMenu from "../icons/IconMinimizeMenu";
import {
  fadeInOut,
  makeSlideInOut,
  makeStagger,
  REDUCED_MOTION,
  SPRING_SMOOTH,
} from "@/constants/motionVariants";

const COLLAPSED_W = 96;
const EXPANDED_W = 300;

const LeftSideBar = () => {
  const pathname = usePathname();
  const [minimize, setMinimise] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const toggleMinimize = useCallback(() => {
    setMinimise((prev) => !prev);
  }, []);
  const transition = useMemo(
    () => (prefersReducedMotion ? REDUCED_MOTION : SPRING_SMOOTH),
    [prefersReducedMotion]
  );
  return (
    <MotionConfig transition={transition}>
      <motion.aside
        layout
        aria-label="Sidebar"
        initial={false}
        animate={{ width: minimize ? COLLAPSED_W : EXPANDED_W }}
        className="hidden lg:flex flex-col gap-6 min-h-screen bg-grey-900 sticky top-0 min-w-[96px] w-[300px] pb-6 rounded-r-2xl "
      >
        {/* Logo */}
        <AnimatePresence mode="wait" initial={false}>
          {minimize ? (
            <motion.div
              key="small-logo"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={makeSlideInOut("left", 20, true, false)}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full px-8 py-10 h-fit"
            >
              <Image
                src="/logo/logo-small.svg"
                width={14}
                height={22}
                alt="App logo (compact)"
                priority
              />
            </motion.div>
          ) : (
            <motion.div
              key="large-logo"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={makeSlideInOut("left", 20, true, false)}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-full px-8 py-10 h-fit"
            >
              <Image src="/logo/logo-large.svg" width={122} height={22} alt="App Logo" priority />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.ul
          id="sidebar-nav"
          initial={false}
          animate={minimize ? "hidden" : "visible"}
          variants={makeStagger(0.1, 0.1)}
          className=" flex flex-col gap-1 pr-6 w-full "
        >
          {NavLinks.map((link) => (
            <SideBarItem
              key={link.label}
              active={pathname === link.href}
              minimize={minimize}
              {...link}
            />
          ))}
        </motion.ul>

        {/* Toggle Minimize/Expand */}
        <button
          type="button"
          aria-pressed={minimize}
          aria-expanded={!minimize}
          aria-controls="sidebar"
          onClick={toggleMinimize}
          title={minimize ? "Expand Menu" : "Minimize Menu"}
          className="btn text-grey-300 px-8 justify-start mt-auto gap-4 hover:text-white h-[56px]"
        >
          <motion.span
            animate={{ rotate: minimize ? 180 : 0 }}
            transition={SPRING_SMOOTH}
            aria-hidden
          >
            <IconMinimizeMenu className="w-6 h-6" />
          </motion.span>
          <AnimatePresence mode="wait" initial={false}>
            {!minimize ? (
              <motion.p
                key="toggle-label"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={makeSlideInOut("left", 10, true, false)}
                className="w-full text-left text-base leading-150 font-bold relative z-20"
              >
                Minimize Menu
              </motion.p>
            ) : (
              <p className="sr-only" key="toggle-sr-only">
                Expand Menu
              </p>
            )}
          </AnimatePresence>
        </button>
      </motion.aside>
    </MotionConfig>
  );
};

export default LeftSideBar;

type SideBarLinkProps = (typeof NavLinks)[number] & { active: boolean; minimize: boolean };

const SideBarItem = memo(function SideBarItem({
  label,
  href,
  Icon,
  active,
  minimize,
}: SideBarLinkProps) {
  return (
    <motion.li
      variants={fadeInOut}
      className="px-8 py-4 bg-transparent w-full inline-flex items-center gap-4 rounded-r-2xl text-grey-300 hover:text-grey-100 transition-all duration-300 ease-in-out relative group h-[56px]"
      data-active={active}
      data-minimize={minimize}
    >
      <Icon className="size-6 text-grey-300 group-data-[active=true]:text-s-green group-hover:text-white transition duration-300 ease-in-out relative z-20 shrink-0" />
      <AnimatePresence mode="sync" initial={false}>
        {minimize ? null : (
          <motion.p
            key="label"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeInOut}
            className="text-base leading-150 font-bold relative group-data-[active=true]:text-grey-900 transition duration-300 ease-in-out z-20"
          >
            {label}
          </motion.p>
        )}
      </AnimatePresence>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className="absolute inset-0 z-30"
        tabIndex={0}
      />

      {active && (
        <motion.span
          id="bg-sidebar"
          layoutId="bg-sidebar"
          className="absolute inset-0 h-full w-full bg-white rounded-r-xl z-10 border-l-4 border-s-green"
        />
      )}
    </motion.li>
  );
});
