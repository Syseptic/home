"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  motion,
  MotionProps,
  MotionValue,
  useMotionValue,
  useTransform,
} from "motion/react";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  iconSize?: number;           // fixed icon square (px)
  iconDistance?: number;       // influence radius for spacing
  iconMagnification?: number;  // accepted but ignored (BC)
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

const DEFAULT_SIZE = 48;
const DEFAULT_DISTANCE = 220;

// Fixed vertical padding → height never changes
const dockVariants = cva(
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 " +
    "mx-auto flex w-max items-center justify-center rounded-2xl border border-white/10 " +
    "py-2 px-3 backdrop-blur-md"
);

type Ctx = {
  size: number;                // icon square
  distance: number;            // spacing influence
  mouseX: MotionValue<number>; // cursor x (viewport) or +∞
  baseGap: number;             // min gap
  maxGap: number;              // max gap near cursor
};

const DockCtx = createContext<Ctx | null>(null);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconDistance = DEFAULT_DISTANCE,
      // iconMagnification is ignored on purpose
      direction = "middle",
      ...props
    },
    ref
  ) => {
    // Pointer position for mouse. Keep +∞ by default.
    const mouseX = useMotionValue<number>(Number.POSITIVE_INFINITY);

    const ctx = useMemo<Ctx>(
      () => ({
        size: iconSize,
        distance: iconDistance,
        mouseX,
        baseGap: 8,
        maxGap: 18,
      }),
      [iconSize, iconDistance, mouseX]
    );

    return (
      <DockCtx.Provider value={ctx}>
        <motion.div
          ref={ref}
          // Only update for mouse; touch will keep +∞ → constant spacing (no glitches)
          onPointerMove={(e) => {
            if (e.pointerType === "mouse") mouseX.set(e.clientX);
          }}
          onPointerLeave={() => {
            // Reset to baseline spacing
            mouseX.set(Number.POSITIVE_INFINITY);
          }}
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

  const padding = Math.max(4, S * 0.1);

  // Distance from cursor; stays "far" (+∞) on touch → constant gap
  const distanceCalc = useTransform(mouseX, (val: number) => {
    const b = ref.current?.getBoundingClientRect();
    if (!b || !isFinite(val)) return D * 2;
    return val - (b.left + b.width / 2);
  });

  // Proximity 0..1
  const absDist = useTransform(distanceCalc, (d) => Math.abs(d));
  const proximity = useTransform(absDist, [0, D], [1, 0]);

  // Gap grows near cursor; symmetric so separators look even
  const gap = useTransform(proximity, [0, 1], [baseGap, maxGap]);

  return (
    <motion.div
      ref={ref}
      style={{
        width: S,
        height: S,
        marginLeft: gap,
        marginRight: gap,
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

  return (
    <motion.span
      ref={ref}
      role="separator"
      className={cn("self-center w-px bg-white/12", className)}
      style={{
        height: Math.round(S * 0.8),
        marginLeft: gap,
        marginRight: gap,
        willChange: "margin",
      }}
    />
  );
}

export { Dock, DockIcon, DockSeparator, dockVariants };
