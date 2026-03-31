import React, { useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import elementResizeEvent from 'element-resize-event'
import { cn } from '@/lib/utils'

interface CarouselProps {
  autoplay?: boolean
  autoplaySpeed?: number
  cssEase?: string
  speed?: number
  hideDots?: boolean
  vertical?: 'horizontal' | 'vertical'
  rtl?: 'flashback' | 'sequence'
  arrows?: boolean
  draggable?: boolean
  range?: {
    start?: number
    end?: number
  }
  doEvents?: (event: string) => void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const CarouselComponent = (props: CarouselProps) => {
  const {
    autoplay = false,
    autoplaySpeed = 3,
    cssEase = 'ease',
    speed = 0.5,
    hideDots = false,
    vertical = 'horizontal',
    rtl = 'sequence',
    arrows = false,
    draggable = true,
    range,
    doEvents,
    children,
    className,
    style,
  } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [api, setApi] = useState<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const slidesCount = React.Children.count(children)

  // Filter children based on range
  const filteredChildren = React.useMemo(() => {
    if (!range || (!range.start && !range.end)) {
      return React.Children.toArray(children)
    }

    const start = range.start ? range.start - 1 : 0
    const end = range.end || slidesCount
    const allChildren = React.Children.toArray(children)

    return allChildren.slice(start, end)
  }, [children, range, slidesCount])

  // Update current slide and trigger events
  useEffect(() => {
    if (!api) return

    api.on('select', () => {
      const newIndex = api.selectedScrollSnap()
      setCurrentSlide(newIndex)
      doEvents?.('beforeChange')
    })
  }, [api, doEvents])

  // Handle resize
  useLayoutEffect(() => {
    const element = containerRef.current
    if (!element) return

    const handleResize = () => {
      // Trigger re-render if needed
    }

    elementResizeEvent(element, handleResize)

    return () => {
      // Cleanup if needed
    }
  }, [])

  // Expose control functions
  const handleNextSlide = useCallback(() => {
    if (api) {
      if (rtl === 'flashback') {
        api.scrollPrev()
      } else {
        api.scrollNext()
      }
    }
  }, [api, rtl])

  const handlePrevSlide = useCallback(() => {
    if (api) {
      if (rtl === 'flashback') {
        api.scrollNext()
      } else {
        api.scrollPrev()
      }
    }
  }, [api, rtl])

  const handleGoToSlide = useCallback(
    (index: number) => {
      if (api) {
        api.scrollTo(index)
      }
    },
    [api]
  )

  // Expose functions to window for external access (legacy pattern support)
  useEffect(() => {
    ;(window as any).carouselNext = handleNextSlide
    ;(window as any).carouselPrev = handlePrevSlide
    ;(window as any).carouselGoTo = handleGoToSlide

    return () => {
      delete (window as any).carouselNext
      delete (window as any).carouselPrev
      delete (window as any).carouselGoTo
    }
  }, [handleNextSlide, handlePrevSlide, handleGoToSlide])

  // Autoplay logic
  useEffect(() => {
    if (!autoplay || !api) return

    const interval = setInterval(() => {
      if (rtl === 'flashback') {
        api.scrollPrev()
      } else {
        api.scrollNext()
      }
    }, autoplaySpeed * 1000)

    return () => clearInterval(interval)
  }, [autoplay, autoplaySpeed, api, rtl])

  // Configure Embla carousel options
  const carouselOpts: any = {
    align: 'start',
    loop: true,
    draggable: draggable,
    ...(rtl === 'flashback' ? { direction: 'rtl' } : {}),
  }

  // Custom animation speed
  useEffect(() => {
    if (!api) return

    // Set transition duration based on speed prop
    const root = api.rootNode()
    if (root) {
      const duration = speed ? speed * 1000 : 500
      root.style.setProperty('--embla-transition-duration', `${duration}ms`)

      // Set easing
      const easing = cssEase || 'ease'
      root.style.setProperty('--embla-transition-timing-function', easing)
    }
  }, [api, speed, cssEase])

  // Set height for vertical mode
  useEffect(() => {
    if (vertical !== 'vertical' || !api) return

    const updateHeight = () => {
      const root = api.rootNode()
      if (!root) return

      // Set height on the root embla container itself
      const carouselEl = carouselRef.current
      if (carouselEl && carouselEl.parentElement) {
        const parentHeight = carouselEl.parentElement.clientHeight
        // Set height on the viewport container
        root.style.height = `${parentHeight}px`
        root.style.overflow = 'hidden'

        // Also set height on the embla container
        const emblaContainer = root.querySelector('[data-embla-container]') as HTMLElement
        if (emblaContainer) {
          emblaContainer.style.height = `${parentHeight}px`
          emblaContainer.style.overflow = 'hidden'
          emblaContainer.classList.remove('h-full')
        }
      }
    }

    // Initial update with a small delay to ensure DOM is ready
    const timer = setTimeout(updateHeight, 100)

    // Update on resize
    const resizeObserver = new ResizeObserver(() => {
      updateHeight()
    })

    const carouselEl = carouselRef.current
    if (carouselEl) {
      resizeObserver.observe(carouselEl.parentElement || carouselEl)
    }

    return () => {
      clearTimeout(timer)
      resizeObserver.disconnect()
    }
  }, [vertical, api])

  if (filteredChildren.length === 0) {
    return (
      <div className={cn('flex items-center justify-center w-full h-full', className)} style={style}>
        <p className="text-muted-foreground text-sm">
          轮播容器中放入多个子组,实现轮播效果,按需定义不同轮播页的内容
        </p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('w-full h-full flex flex-col relative', className)}
      style={style}
    >
      <div className={cn(
        "flex-1",
        vertical === 'vertical' ? '' : ''
      )}>
        <Carousel
          ref={carouselRef}
          opts={carouselOpts}
          setApi={setApi}
          className={cn(
            "w-full h-full"
          )}
          orientation={vertical}
        >
          <CarouselContent className={cn(
            vertical === 'vertical' ? 'h-full -mt-1' : 'h-full'
          )}>
            {filteredChildren.map((child, index) => (
              <CarouselItem
                key={index}
                className={cn(
                  "basis-full",
                  vertical === 'vertical' ? 'pt-1' : ''
                )}
              >
                {child}
              </CarouselItem>
            ))}
          </CarouselContent>

          {!arrows && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>

      {/* Custom dots indicator */}
      {!hideDots && filteredChildren.length > 1 && (
        <div className="flex gap-2 justify-center mt-4 shrink-0">
          {filteredChildren.map((_, index) => (
            <button
              key={index}
              className={cn(
                'rounded-full transition-all h-2',
                currentSlide === index
                  ? 'bg-primary w-8'
                  : 'bg-primary/30 w-2'
              )}
              onClick={() => handleGoToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { CarouselComponent as Carousel }
export type { CarouselProps }
