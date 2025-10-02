"use client";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "motion/react";
import React from "react";
import PotCard from "../cards/PotCard";
import { cardEnterExit, cardEnterExitTransition } from "@/lib/variants/layout-variants";
import { reducedMotionTransition } from "@/lib/variants/variants";

const PotsClientList = ({ potsData }: { potsData: PotJSON[] }) => {
  const prefersReducedMotion = useReducedMotion();
  const notAvailableThemes = potsData ? potsData.map((pot) => pot.themeId._id.toString()) : [];
  return (
    <MotionConfig
      transition={prefersReducedMotion ? reducedMotionTransition : cardEnterExitTransition}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {potsData.length !== 0 && (
          <motion.ul
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardEnterExit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center justify-start w-full"
            layout
          >
            <AnimatePresence initial={false} mode="popLayout">
              {potsData.map((pot) => (
                <motion.li
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={String(pot.id)}
                  variants={cardEnterExit}
                >
                  <PotCard pot={pot} notAvailableThemes={notAvailableThemes} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};

export default PotsClientList;
