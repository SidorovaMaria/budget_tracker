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
