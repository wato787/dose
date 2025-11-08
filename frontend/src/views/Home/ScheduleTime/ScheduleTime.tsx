import { useMedicines } from "@/hooks/useMedicines"
import { useMemo } from "react"

export const ScheduleTime = () => {
  const { data: medicinesData } = useMedicines({ isActive: true })
  const medicines = medicinesData?.medicines || []

  // 本日の最初のスケジュールの時間を表示
  const todaySchedule = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const allSchedules = medicines.flatMap((m) => m.schedules || [])
    return allSchedules
      .filter((schedule) => {
        const startDate = new Date(schedule.startDate)
        startDate.setHours(0, 0, 0, 0)
        return startDate <= today
      })
      .sort((a, b) => a.time.localeCompare(b.time))[0]
  }, [medicines])

  if (!todaySchedule) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      <p className="text-lg font-medium text-foreground min-w-fit">{todaySchedule.time}</p>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}


