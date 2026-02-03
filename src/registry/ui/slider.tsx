import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const _values = React.useMemo(
    () =>
      Array.isArray(props.value)
        ? props.value
        : Array.isArray(props.defaultValue)
          ? props.defaultValue
          : [props.min, props.max],
    [props.value, props.defaultValue, props.min, props.max]
  )
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className={cn(
        "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary",
        className
      )}>
        <SliderPrimitive.Range className={cn("absolute h-full bg-primary", props.orientation == 'vertical' ? "w-full" : "h-full")} />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => {
        return (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="group border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          >
            {props.value && props.value[index] ? (
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-7 hidden group-hover:block text-xs bg-primary text-primary-foreground px-2 py-1 rounded"
              >
                {props.value[index]}
              </div>
            ) : null}
          </SliderPrimitive.Thumb>
        )
      })}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
