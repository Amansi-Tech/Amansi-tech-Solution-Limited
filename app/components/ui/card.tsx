// components/ui/card.tsx
import * as React from "react";
import { cn } from "../../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-white p-6 shadow-md dark:bg-gray-900",
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

export { Card };
