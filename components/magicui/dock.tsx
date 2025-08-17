"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  motion,
  MotionProps,
  MotionValue,
  useMotionValue,
  useTransform,
  useSpring,
} from "motion/react";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

/** Props for the Dock container (no magnification; spacing-only) */
export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  iconSize?: number;          // fixed icon square (px)
  iconDistance?: number;      // influence radius for spacing
  // iconMagnification?: number; // ignored, kept out to avoid confusion
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

/** Defaults */
const DEFAULT_SIZE = 48;
const DEFAULT_DISTANCE = 220;

/** Fixed vertical padding → height never changes */
const dockVariants = cva(
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 " +
    "mx-auto flex w-max items-center justify-center rounded-2xl border border-white/10 " +
    "py-2 px-3 backdrop-blur-md"
);

/** Internal context shared with icons & separators */
type Ctx = {
  size: number;                // icon square
  distance: number;            // spacing influence
  mouseX: MotionValue<number>; // smoothed cursor x (viewport) or +∞
  baseGap: number;             // min gap
  maxGap: number;              // max gap near cursor
};

const DockCtx = createContext<Ctx | null>(null);

/** Dock container */
const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconDistance = DEFAULT_DISTANCE,
      direction = "middle",
      ...props
    },
    ref
  ) => {
    // Source pointer position. Defaults to "far away" (baseline gaps).
    const rawX = useMotionValue<number>(Number.POSITIVE_INFINITY);

    // Smooth the pointer for buttery motion.
    const smoothedX = useSpring(rawX, {
      stiffness: 180,
      damping: 26,
      mass: 0.25,
    });

    const ctx = useMemo<Ctx>(
      () => ({
        size: iconSize,
        distance: iconDistance,
        mouseX: smoothedX,
        baseGap: 8,
        maxGap: 18,
      }),
      [iconSize, iconDistance, smoothedX]
    );

    return (
      <DockCtx.Provider value={ctx}>
        <motion.div
          ref={ref}
          // Desktop/trackpads: always update via mouse events.
          onMouseMove={(e) => rawX.set(e.clientX)}
          // Pens/other non-touch pointers also work:
          onPointerMove={(e) => {
            if (e.pointerType !== "touch") rawX.set(e.clientX);
          }}
          // Reset to baseline on leave.
          onMouseLeave={() => rawX.set(Number.POSITIVE_INFINITY)}
          onPointerLeave={() => rawX.set(Number.POSITIVE_INFINITY)}
          {...props}
          className={cn(dockVariants({ className }), {
            "items-start": direction === "top",
            "items-center": direction === "middle",
            "items-end": direction === "bottom",
          })}
        >
          {children}
        </motion.div>
      </DockCtx.Provider>
    );
  }
);
Dock.displayName = "Dock";

/** Dock icon (fixed size; spacing animates) */
export interface DockIconProps
  extends Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, "children"> {
  className?: string;
  children?: React.ReactNode;
  props?: PropsWithChildren;
}

const DockIcon = ({ className, children, ...props }: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const ctx = useContext(DockCtx);
  if (!ctx) throw new Error("DockIcon must be used within <Dock/>");

  const { size: S, distance: D, mouseX, baseGap, maxGap } = ctx;

  // Keep height constant via fixed size + fixed padding.
  const padding = Math.max(4, S * 0.1);

  // Distance from (smoothed) cursor to this icon’s center.
  const distanceCalc = useTransform(mouseX, (val: number) => {
    const b = ref.current?.getBoundingClientRect();
    if (!b || !isFinite(val)) return D * 2; // far → baseline
    return val - (b.left + b.width / 2);
  });

  // Proximity 0..1 (closest → 1)
  const absDist = useTransform(distanceCalc, (d) => Math.abs(d));
  const proximity = useTransform(absDist, [0, D], [1, 0]);

  // Gap grows near cursor; spring for smoothness.
  const gap = useTransform(proximity, [0, 1], [baseGap, maxGap]);
  const gapSpring = useSpring(gap, { stiffness: 260, damping: 30, mass: 0.3 });

  return (
    <motion.div
      ref={ref}
      style={{
        width: S,
        height: S,
        marginLeft: gapSpring,
        marginRight: gapSpring,
        padding,
        willChange: "margin",
      }}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
DockIcon.displayName = "DockIcon";

/** Thin vertical divider that shares the same spacing animation */
function DockSeparator({ className }: { className?: string }) {
  const ctx = useContext(DockCtx)!;
  const { size: S, mouseX, distance: D, baseGap, maxGap } = ctx;
  const ref = useRef<HTMLSpanElement>(null);

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const b = ref.current?.getBoundingClientRect();
    if (!b || !isFinite(val)) return D * 2;
    return val - (b.left + b.width / 2);
  });

  const absDist = useTransform(distanceCalc, (d) => Math.abs(d));
  const proximity = useTransform(absDist, [0, D], [1, 0]);

  const gap = useTransform(proximity, [0, 1], [baseGap, maxGap]);
  const gapSpring = useSpring(gap, { stiffness: 260, damping: 30, mass: 0.3 });

  return (
    <motion.span
      ref={ref}
      role="separator"
      className={cn("self-center w-px bg-white/12", className)}
      style={{
        height: Math.round(S * 0.8),
        marginLeft: gapSpring,
        marginRight: gapSpring,
        willChange: "margin",
      }}
    />
  );
}

export { Dock, DockIcon, DockSeparator, dockVariants };
