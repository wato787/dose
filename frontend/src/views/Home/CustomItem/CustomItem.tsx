import { Card } from "@/components/ui/card"

interface CustomItem {
  custom_item_id: number
  medicine_id: number
  item_name: string
  data_type: string
  is_required: boolean
}

interface CustomItemProps {
  item: CustomItem
  isChecked: boolean
  onToggle: () => void
}

export const CustomItem = ({ item, isChecked, onToggle }: CustomItemProps) => {
  return (
    <Card
      className={`p-3 cursor-pointer transition-all border-2 ${
        isChecked ? "bg-accent/5 border-accent/30" : "border-border hover:border-accent/20"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 2h13.856a2 2 0 011.941 2.857l-2.5 8.2a2 2 0 01-1.941 2.151H5.059A2 2 0 013 13.148l2.5-8.2a2 2 0 011.941-2.857z"
            />
          </svg>
          <p className="text-sm text-foreground">{item.item_name}</p>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            isChecked ? "bg-accent border-accent" : "border-muted-foreground"
          }`}
        >
          {isChecked && (
            <svg
              className="w-3 h-3 text-accent-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </Card>
  )
}


