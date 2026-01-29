import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/registry/components/ui/label/label"
import { Input } from "@/registry/components/ui/input/input"
import { Slider } from "@/registry/components/ui/slider/slider"

export interface Property {
  key: string
  label: string
  type: "text" | "number" | "color" | "select" | "slider"
  value: any
  options?: { label: string; value: any }[]
  min?: number
  max?: number
  step?: number
  unit?: string
  onChange?: (value: any) => void
}

export interface PropertyPanelProps {
  title?: string
  properties: Property[]
  onChange?: (key: string, value: any) => void
  className?: string
}

const PropertyItem: React.FC<{
  property: Property
  onChange?: (key: string, value: any) => void
}> = ({ property, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(property.key, e.target.value)
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(property.key, e.target.value)
  }

  const handleSliderChange = (value: number) => {
    onChange?.(property.key, value)
  }

  switch (property.type) {
    case "text":
      return (
        <div className="property-item">
          <Label className="property-label">{property.label}</Label>
          <Input
            type="text"
            value={property.value || ""}
            onChange={handleInputChange}
            className="property-input"
          />
        </div>
      )

    case "number":
      return (
        <div className="property-item">
          <Label className="property-label">{property.label}</Label>
          <Input
            type="number"
            value={property.value ?? 0}
            onChange={handleInputChange}
            className="property-input"
          />
        </div>
      )

    case "color":
      return (
        <div className="property-item">
          <Label className="property-label">{property.label}</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={property.value || "#000000"}
              onChange={handleInputChange}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <Input
              type="text"
              value={property.value || ""}
              onChange={handleInputChange}
              className="property-input flex-1"
            />
          </div>
        </div>
      )

    case "select":
      return (
        <div className="property-item">
          <Label className="property-label">{property.label}</Label>
          <select
            value={property.value ?? ""}
            onChange={handleSelectChange}
            className="property-select"
          >
            {property.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )

    case "slider":
      return (
        <div className="property-item">
          <Label className="property-label">{property.label}</Label>
          <div className="flex items-center gap-2 flex-1">
            <Slider
              value={[property.value ?? 0]}
              onValueChange={([value]) => handleSliderChange(value)}
              min={property.min}
              max={property.max}
              step={property.step}
              className="flex-1"
            />
            <Input
              type="number"
              value={property.value ?? 0}
              onChange={handleInputChange}
              min={property.min}
              max={property.max}
              step={property.step}
              className="property-input w-20"
              style={{ minWidth: "60px" }}
            />
            {property.unit && <span className="text-xs text-slate-500">{property.unit}</span>}
          </div>
        </div>
      )

    default:
      return null
  }
}

export const PropertyPanel = React.forwardRef<HTMLDivElement, PropertyPanelProps>(
  (
    {
      title = "属性",
      properties = [],
      onChange,
      className,
    },
    ref
  ) => {
    const handlePropertyChange = (key: string, value: any) => {
      onChange?.(key, value)
    }

    // 分组属性
    const groupedProperties = React.useMemo(() => {
      const groups: Record<string, Property[]> = {}

      properties.forEach((prop) => {
        const group = prop.key.split(".")[0]
        if (!groups[group]) {
          groups[group] = []
        }
        groups[group].push(prop)
      })

      return groups
    }, [properties])

    return (
      <div ref={ref} className={cn("property-panel", className)}>
        <div className="property-panel-header">
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>

        <div className="property-panel-content">
          {Object.entries(groupedProperties).map(([groupName, groupProps]) => (
            <div key={groupName} className="property-group">
              <h4 className="property-group-title">{groupName}</h4>
              {groupProps.map((prop) => (
                <PropertyItem
                  key={prop.key}
                  property={prop}
                  onChange={handlePropertyChange}
                />
              ))}
            </div>
          ))}

          {properties.length === 0 && (
            <div className="property-empty">
              <p className="text-sm text-slate-500">未选择任何元素</p>
            </div>
          )}
        </div>
      </div>
    )
  }
)

PropertyPanel.displayName = "PropertyPanel"
