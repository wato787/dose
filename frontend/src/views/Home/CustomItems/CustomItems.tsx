import { CustomItem } from "../CustomItem"

interface CustomItemData {
  custom_item_id: number
  medicine_id: number
  item_name: string
  data_type: string
  is_required: boolean
}

interface CustomItemsProps {
  items: CustomItemData[]
  customLogs: Record<number, boolean | string>
  onToggle: (customItemId: number) => void
}

export const CustomItems = ({ items, customLogs, onToggle }: CustomItemsProps) => {
  if (items.length === 0) return null

  return (
    <div className="space-y-2 pl-2 border-l-2 border-primary/20">
      <p className="text-xs font-medium text-muted-foreground">追加記録項目</p>
      {items.map((item) => (
        <CustomItem
          key={item.custom_item_id}
          item={item}
          isChecked={!!customLogs[item.custom_item_id]}
          onToggle={() => onToggle(item.custom_item_id)}
        />
      ))}
    </div>
  )
}

