import { Pill, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Medicine {
  id: number
  name: string
  time: string
  taken: boolean
  color: "primary" | "accent" | "secondary"
}

export const MedicineList = ({ medicines }: { medicines: Medicine[] }) => {
  return (
    <div className="space-y-2">
      {medicines.map((medicine) => (
        <Card key={medicine.id} className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <Pill className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{medicine.name}</p>
              <p className="text-xs text-muted-foreground">{medicine.time}服用</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive h-8 w-8 p-0">
            <Trash2 className="w-4 h-4" />
          </Button>
        </Card>
      ))}
    </div>
  )
}
