import { Transition, Variants } from "motion";

export const blockEnter: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};
export const blockEnterTransition: Transition = {
  opacity: {
    duration: 1,
    type: "tween",
    ease: "easeInOut",
  },
  y: {
    type: "spring",
    stiffness: 50,
    damping: 24,
    mass: 3,
  },
};
export const cardEnterExit: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
  },
};
export const cardEnterExitTransition: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 30,
  mass: 0.6,
};
