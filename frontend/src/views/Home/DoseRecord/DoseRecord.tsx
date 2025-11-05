import { Pill } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Medicine {
  medicine_id: number
  name: string
  description?: string
  is_active: boolean
}

interface DoseLog {
  dose_log_id: number
  schedule_id: number
  record_date: string
  is_taken: boolean
  taken_at: string | null
}

interface DoseRecordProps {
  medicine: Medicine
  doseLog: DoseLog
  onToggle: () => void
}

export const DoseRecord = ({ medicine, doseLog, onToggle }: DoseRecordProps) => {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all border-2 ${
        doseLog.is_taken ? "bg-primary/5 border-primary/30" : "border-border hover:border-primary/20"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Pill className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-foreground">{medicine.name}</p>
          </div>
          {medicine.description && <p className="text-xs text-muted-foreground mt-1">{medicine.description}</p>}
        </div>
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            doseLog.is_taken ? "bg-primary border-primary" : "border-muted-foreground"
          }`}
        >
          {doseLog.is_taken && (
            <svg
              className="w-4 h-4 text-primary-foreground"
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


