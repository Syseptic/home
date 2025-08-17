// Strongly-typed motion elements so TS accepts className, style, events, etc.
import { motion, type MotionProps } from "framer-motion";
import React from "react";

export const MotionDiv = motion.div as React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> &
    MotionProps &
    React.RefAttributes<HTMLDivElement>
>;

export const MotionSpan = motion.span as React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLSpanElement> &
    MotionProps &
    React.RefAttributes<HTMLSpanElement>
>;
