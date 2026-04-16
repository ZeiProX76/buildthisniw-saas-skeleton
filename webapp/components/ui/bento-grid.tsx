import { ComponentPropsWithoutRef, ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  description: string
  href: string
  cta: string
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col overflow-hidden rounded-xl",
      "bg-card border border-border/50 shadow-sm",
      className
    )}
    {...props}
  >
    {/* Visual area — always fully visible, takes up most of the card */}
    <div className="relative flex-1 min-h-0">{background}</div>

    {/* Text area — always visible, no animations, no shifting */}
    <div className="p-4 pt-3">
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" />
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground leading-tight">
            {name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </div>
      <a
        href={href}
        className="mt-3 inline-flex items-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {cta}
        <ArrowRightIcon className="ms-1.5 h-3 w-3 rtl:rotate-180" />
      </a>
    </div>
  </div>
)

export { BentoCard, BentoGrid }
