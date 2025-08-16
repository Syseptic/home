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
  useContext,
  useMemo,
  useRef,
  useState,
  createContext,
} from "react";
import { cn } from "@/lib/utils";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  iconDistance?: number;
  direction?: "top" | "middle" | "bottom";
  children: React.ReactNode;
}

const DEFAULT_SIZE = 48;
const DEFAULT_MAGNIFICATION = 96;
const DEFAULT_DISTANCE = 240;

const dockVariants = cva(
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 " +
    "mx-auto flex w-max items-center justify-center rounded-2xl border border-white/10 " +
    "backdrop-blur-md"
);

// Context so the separator can center/space itself
type Ctx = { size: number; magnification: number; distance: number };
const DockCtx = createContext<Ctx>({
  size: DEFAULT_SIZE,
  magnification: DEFAULT_MAGNIFICATION,
  distance: DEFAULT_DISTANCE,
});

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      direction = "middle",
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue<number>(Number.POSITIVE_INFINITY);

    // widen dock when hovered
    const [hovering, setHovering] = useState(false);
    const hoverSpring = useSpring(hovering ? 1 : 0, { stiffness: 220, damping: 26 });
    const padX = useTransform(hoverSpring, [0, 1], [12, 22]);
    const padY = 8;

    const ctxValue = useMemo<Ctx>(
      () => ({ size: iconSize, magnification: iconMagnification, distance: iconDistance }),
      [iconSize, iconMagnification, iconDistance]
    );

    const renderChildren = () =>
      React.Children.map(children, (child) => {
        if (React.isValidElement<DockIconProps>(child) && child.type === DockIcon) {
          return React.cloneElement(child, {
            ...child.props,
            mouseX,
            size: iconSize,
            magnification: iconMagnification,
            distance: iconDistance,
          });
        }
        return child;
      });

    return (
      <DockCtx.Provider value={ctxValue}>
        <motion.div
          ref={ref}
          // 👉 pointer events are more reliable across devices
          onPointerMove={(e) => mouseX.set(e.clientX)}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => {
            mouseX.set(Number.POSITIVE_INFINITY); // far away → baseline size
            setHovering(false);
          }}
          style={{ paddingLeft: padX, paddingRight: padX, paddingTop: padY, paddingBottom: padY }}
          {...props}
          className={cn(dockVariants({ className }), {
            "items-start": direction === "top",
            "items-center": direction === "middle",
            "items-end": direction === "bottom",
          })}
        >
          {renderChildren()}
        </motion.div>
      </DockCtx.Provider>
    );
  }
);

Dock.displayName = "Dock";

export interface DockIconProps
  extends Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, "children"> {
  size?: number;
  magnification?: number;
  distance?: number;
  mouseX?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
  props?: PropsWithChildren;
}

const DockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const padding = Math.max(4, size * 0.1);

  const distanceCalc = useTransform(mouseX ?? useMotionValue(Number.POSITIVE_INFINITY), (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || !isFinite(val)) return distance * 2; // far away → baseline
    return val - (bounds.left + bounds.width / 2);
  });

  // size growth
  const sizeTransform = useTransform(distanceCalc, [-distance, 0, distance], [size, magnification, size]);
  const scaleSize = useSpring(sizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  // slight nudge toward cursor
  const xTransform = useTransform(distanceCalc, [-distance, 0, distance], [10, 0, -10]);

  // spacing grows with size (push neighbors)
  const gapTransform = useTransform(sizeTransform, [size, magnification], [8, 18]);

  return (
    <motion.div
      ref={ref}
      style={{
        width: scaleSize,
        height: scaleSize,
        padding,
        x: xTransform,
        marginLeft: gapTransform,
        marginRight: gapTransform,
      }}
      className={cn("flex aspect-square cursor-pointer items-center justify-center rounded-full", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

function DockSeparator({ className }: { className?: string }) {
  const { size } = useContext(DockCtx);
  const height = Math.round(size * 0.8);

  const ml = 0;                         
  const mr = Math.round(size * 0.32);    

  return (
    <span
      role="separator"
      className={cn("self-center w-px bg-white/10", className)}
      style={{ height, marginLeft: ml, marginRight: mr }}
    />
  );
}

export { Dock, DockIcon, DockSeparator, dockVariants };
