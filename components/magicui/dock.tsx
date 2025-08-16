"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  motion,
  MotionProps,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  iconSize?: number;          // fixed icon square (px)
  iconDistance?: number;      // influence radius for spacing
  iconMagnification?: number;
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

const DEFAULT_SIZE = 48;
const DEFAULT_DISTANCE = 220;

// fixed vertical padding; height never changes
const dockVariants = cva(
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 " +
    "mx-auto flex w-max items-center justify-center rounded-2xl border border-white/10 " +
    "py-2 px-3 backdrop-blur-md"
);

type Ctx = {
  size: number;                // icon square
  distance: number;            // spacing influence
  mouseX: MotionValue<number>; // cursor x (viewport)
  isCoarse: boolean;           // touch/pen
  baseGap: number;             // min icon gap
  maxGap: number;              // max icon gap near cursor
};

const DockCtx = createContext<Ctx | null>(null);

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
    const mouseX = useMotionValue<number>(Number.POSITIVE_INFINITY);

    // detect coarse pointer to avoid hover on touch
    const [isCoarse, setIsCoarse] = useState(false);
    useEffect(() => {
      const q = window.matchMedia?.("(pointer: coarse)");
      if (q) setIsCoarse(q.matches);
      const on = (e: MediaQueryListEvent) => setIsCoarse(e.matches);
      q?.addEventListener?.("change", on);
      return () => q?.removeEventListener?.("change", on);
    }, []);

    // Dock widens horizontally (padding-x) when hovering (mouse only)
    const [hovering, setHovering] = useState(false);
    const hoverSpring = useSpring(hovering ? 1 : 0, { stiffness: 220, damping: 26 });
    const padX = useTransform(hoverSpring, [0, 1], [12, 22]); // px

    const ctx = useMemo<Ctx>(
      () => ({
        size: iconSize,
        distance: iconDistance,
        mouseX,
        isCoarse,
        baseGap: 8,
        maxGap: 18,
      }),
      [iconSize, iconDistance, mouseX, isCoarse]
    );

    return (
      <DockCtx.Provider value={ctx}>
        <motion.div
          ref={ref}
          onPointerMove={(e) => {
            if (e.pointerType === "mouse") {
              mouseX.set(e.clientX);
              setHovering(true);
            }
          }}
          onPointerLeave={() => {
            mouseX.set(Number.POSITIVE_INFINITY);
            setHovering(false);
          }}
          style={{
            paddingLeft: padX,
            paddingRight: padX,
            // vertical padding is fixed via class "py-2" -> height stays constant
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

  const { size: S, distance: D, mouseX, isCoarse, baseGap, maxGap } = ctx;

  // fixed padding inside the icon circle; height never changes
  const padding = Math.max(4, S * 0.1);

  // On touch/coarse, don't track hover -> baseline spacing (smooth finger slide)
  const sourceX: MotionValue<number> = isCoarse
    ? useMotionValue<number>(Number.POSITIVE_INFINITY)
    : mouseX;

  // distance from cursor to this icon center
  const distanceCalc = useTransform(sourceX, (val: number) => {
    const b = ref.current?.getBoundingClientRect();
    if (!b || !isFinite(val)) return D * 2;
    return val - (b.left + b.width / 2);
  });

  // proximity 0..1 (1 = closest)
  const absDist = useTransform(distanceCalc, (d) => Math.abs(d));
  const proximity = useTransform(absDist, [0, D], [1, 0]);

  // gap grows near cursor; symmetric L/R so separators look even
  const gap = useTransform(proximity, [0, 1], [baseGap, maxGap]);

  return (
    <motion.div
      ref={ref}
      style={{
        width: S,
        height: S,
        marginLeft: gap,
        marginRight: gap,
        // padding doesn't animate -> constant height feel
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
  const { size: S, baseGap, maxGap, mouseX, distance: D, isCoarse } = ctx;
  const ref = useRef<HTMLSpanElement>(null);

  // On touch, keep baseline margins on separator too
  const sourceX: MotionValue<number> = isCoarse
    ? useMotionValue<number>(Number.POSITIVE_INFINITY)
    : mouseX;

  const distanceCalc = useTransform(sourceX, (val: number) => {
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
