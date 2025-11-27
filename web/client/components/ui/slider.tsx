"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  max?: number
  min?: number
  step?: number
  className?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value, onValueChange, max = 100, min = 0, step = 1, className }, ref) => {
    const handleChange = (index: number, newValue: number) => {
      const newValues = [...value]
      newValues[index] = Math.max(min, Math.min(max, newValue))
      if (index === 0 && newValues[0] > newValues[1]) {
        newValues[0] = newValues[1]
      }
      if (index === 1 && newValues[1] < newValues[0]) {
        newValues[1] = newValues[0]
      }
      onValueChange(newValues)
    }

    const leftPercent = ((value[0] - min) / (max - min)) * 100
    const rightPercent = ((value[1] - min) / (max - min)) * 100

    return (
      <div
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center", className)}
      >
        <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <div
            className="absolute h-full bg-primary"
            style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => handleChange(0, Number(e.target.value))}
          className="absolute h-5 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{ left: `calc(${leftPercent}% - 10px)` }}
        />
        <div
          className="absolute h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          style={{ left: `calc(${rightPercent}% - 10px)` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => handleChange(1, Number(e.target.value))}
          className="absolute h-5 w-full opacity-0 cursor-pointer"
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
