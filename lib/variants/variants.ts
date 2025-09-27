import { Transition, Variants } from "motion";

export const reducedMotionTransition: Transition = {
  duration: 0.2,
  type: "tween",
  ease: "linear",
};

export const fadeInFadeOut: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, type: "tween" },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, type: "tween" },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2, type: "tween" },
  },
};
export const fadeInFadeOutReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
