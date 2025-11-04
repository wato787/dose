
import { useState } from "react"
import { Check } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Medicine {
  id: number
  name: string
  time: string
  taken: boolean
  color: "primary" | "accent" | "secondary"
}

  const colorMap = {
    primary: "bg-primary/10 border-primary/20 text-primary",
    accent: "bg-accent/10 border-accent/20 text-accent",
    secondary: "bg-secondary/10 border-secondary/20 text-secondary",
  }

export const TodayMedicines = ({ medicines }: { medicines: Medicine[] }) => {
  const [medicineStates, setMedicineStates] = useState<Record<number, boolean>>(
    Object.fromEntries(medicines.map((m) => [m.id, m.taken])),
  )

  const handleToggle = (id: number) => {
    setMedicineStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="space-y-2">
      {medicines.map((medicine) => (
        <Card
          key={medicine.id}
          className={`p-4 cursor-pointer transition-all border-2 ${
            medicineStates[medicine.id] ? "bg-primary/5 border-primary/30" : "border-border hover:border-primary/20"
          }`}
          onClick={() => handleToggle(medicine.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{medicine.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{medicine.time}服用</p>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                medicineStates[medicine.id] ? "bg-primary border-primary" : "border-muted-foreground"
              }`}
            >
              {medicineStates[medicine.id] && <Check className="w-4 h-4 text-primary-foreground" />}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
