import { stagger, Transition, Variants } from "motion";

export const SPRING_SNAPPY: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
  mass: 0.6,
};

export const TWEEN_SOFT: Transition = {
  type: "tween",
  ease: [0.22, 1, 0.36, 1],
  duration: 0.3,
};
export const REDUCED_MOTION: Transition = {
  type: "tween",
  ease: "linear",
  duration: 0.01,
};
export const SPRING_SMOOTH: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 0.5,
};

export const fadeInOut = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: TWEEN_SOFT },
  exit: { opacity: 0, transition: TWEEN_SOFT, duration: 0.2 },
};

export const blurInOut = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: TWEEN_SOFT,
  },
  exit: { opacity: 0, filter: "blur(6px)", transition: { ...TWEEN_SOFT, duration: 0.2 } },
};

type Dir = "up" | "down" | "left" | "right";
export function makeSlideIn(dir: Dir, distance = 20, withFade = true, spring = true): Variants {
  const delta = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }[dir];
  const to = spring ? SPRING_SNAPPY : TWEEN_SOFT;
  return {
    hidden: { ...(withFade ? { opacity: 0 } : {}), ...delta },
    visible: { ...(withFade ? { opacity: 1 } : {}), x: 0, y: 0, transition: to },
    exit: { ...(withFade ? { opacity: 0 } : {}), ...delta, transition: to },
  };
}
export const slideUp = makeSlideIn("up");
export const slideDown = makeSlideIn("down");
export const slideLeft = makeSlideIn("left");
export const slideRight = makeSlideIn("right");

export function makeSlideInOut(dir: Dir, distance = 20, withFade = true, spring = true): Variants {
  const delta = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }[dir];
  const deltaOut = {
    up: { y: -distance },
    down: { y: distance },
    left: { x: -distance },
    right: { x: distance },
  }[dir];
  const to = spring ? SPRING_SNAPPY : TWEEN_SOFT;
  return {
    hidden: { ...(withFade ? { opacity: 0 } : {}), ...delta },
    visible: { ...(withFade ? { opacity: 1 } : {}), x: 0, y: 0, transition: to },
    exit: { ...(withFade ? { opacity: 0 } : {}), ...deltaOut, transition: to },
  };
}

export const slideUpDown = makeSlideInOut("up");
export const slideDownUp = makeSlideInOut("down");
export const slideLeftRight = makeSlideInOut("left");
export const slideRightLeft = makeSlideInOut("right");

export function makeStagger(stagger = 0.06, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
    exit: { transition: { staggerChildren: Math.min(stagger, 0.04), when: "afterChildren" } },
  };
}
