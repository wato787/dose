
import { useState } from "react"
import { TodayProgress } from "./TodayProgress"
import { ScheduleTime } from "./ScheduleTime"
import { DoseRecord } from "./DoseRecord"
import { CustomItems } from "./CustomItems"

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
  const [doseLog, setDoseLog] = useState<{
    dose_log_id: number
    schedule_id: number
    record_date: string
    is_taken: boolean
    taken_at: string | null
  }>({
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
      <TodayProgress completionRate={completionRate} />

      <section className="px-4 py-6 space-y-4">
        <ScheduleTime time={schedule.time} />

        <div className="space-y-3">
          <DoseRecord medicine={medicine} doseLog={doseLog} onToggle={handleDoseToggle} />

          <CustomItems items={customItems} customLogs={customLogs} onToggle={handleCustomToggle} />
        </div>
      </section>
    </main>
  )
}
