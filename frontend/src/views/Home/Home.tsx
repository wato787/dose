


import { useState } from "react"
import { Pill } from "lucide-react"
import { Card } from "@/components/ui/card"

export const Home = () => {
  // Medicine (薬の基本情報)
  const medicine = {
    medicine_id: 1,
    name: "ピル",
    description: "避妊薬",
    is_active: true,
  }

  // Schedule (服用スケジュール)
  const schedule = {
    schedule_id: 1,
    medicine_id: 1,
    time: "23:00",
    frequency_type: "DAILY",
    start_date: "2025-01-01",
  }

  // CustomItem (カスタム記録項目)
  const customItems = [
    {
      custom_item_id: 1,
      medicine_id: 1,
      item_name: "出血",
      data_type: "BOOL",
      is_required: false,
    },
  ]

  // DoseLog (本日の服用記録)
  const [doseLog, setDoseLog] = useState({
    dose_log_id: 1,
    schedule_id: 1,
    record_date: new Date().toISOString().split("T")[0],
    is_taken: false,
    taken_at: null,
  })

  // CustomLog (カスタム項目の記録)
  const [customLogs, setCustomLogs] = useState<Record<number, boolean | string>>({
    1: false, // 出血チェック
  })

  const handleDoseToggle = () => {
    setDoseLog((prev) => ({
      ...prev,
      is_taken: !prev.is_taken,
      taken_at: !prev.is_taken ? new Date().toISOString() : null,
    }))
  }

  const handleCustomToggle = (customItemId: number) => {
    setCustomLogs((prev) => ({
      ...prev,
      [customItemId]: !prev[customItemId],
    }))
  }

  const completionRate = doseLog.is_taken ? 100 : 0

  return (
    <main className="min-h-screen bg-background pb-24">

      {/* Today Summary Card */}
      <section className="px-4 py-6 space-y-4">
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10 p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">本日の進捗</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-light text-primary">{completionRate}</p>
                <p className="text-xs text-muted-foreground">%</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
        </Card>
      </section>

      <section className="px-4 py-6 space-y-4">
        {/* Time and Schedule Section */}
        <div className="flex items-center gap-3">
          <p className="text-lg font-medium text-foreground min-w-fit">{schedule.time}</p>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-3">
          {/* Dose Record Card */}
          <Card
            className={`p-4 cursor-pointer transition-all border-2 ${
              doseLog.is_taken ? "bg-primary/5 border-primary/30" : "border-border hover:border-primary/20"
            }`}
            onClick={handleDoseToggle}
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

          {/* Custom Items Section */}
          {customItems.length > 0 && (
            <div className="space-y-2 pl-2 border-l-2 border-primary/20">
              <p className="text-xs font-medium text-muted-foreground">追加記録項目</p>
              {customItems.map((item) => (
                <Card
                  key={item.custom_item_id}
                  className={`p-3 cursor-pointer transition-all border-2 ${
                    customLogs[item.custom_item_id]
                      ? "bg-accent/5 border-accent/30"
                      : "border-border hover:border-accent/20"
                  }`}
                  onClick={() => handleCustomToggle(item.custom_item_id)}
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
                        customLogs[item.custom_item_id] ? "bg-accent border-accent" : "border-muted-foreground"
                      }`}
                    >
                      {customLogs[item.custom_item_id] && (
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
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
