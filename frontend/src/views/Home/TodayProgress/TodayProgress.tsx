import { Card } from "@/components/ui/card"
import { useDoseLogs } from "@/hooks/useDoseLogs"
import { useMedicines } from "@/hooks/useMedicines"
import { useMemo } from "react"

export const TodayProgress = () => {
  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  const { data: medicinesData } = useMedicines({ isActive: true })
  const medicines = medicinesData?.medicines || []

  const { data: doseLogsData } = useDoseLogs()
  const doseLogs = doseLogsData?.doseLogs || []

  // 本日のスケジュールと服用ログを取得
  const allSchedules = medicines.flatMap((m) => m.schedules || [])
  const todaySchedules = allSchedules.filter((schedule) => {
    const startDate = new Date(schedule.startDate)
    startDate.setHours(0, 0, 0, 0)
    return startDate <= today
  })

  const todayDoseLogs = doseLogs.filter((log) => {
    const logDate = new Date(log.recordDate)
    logDate.setHours(0, 0, 0, 0)
    return logDate.getTime() === today.getTime()
  })

  // 進捗率を計算（本日のスケジュールのうち、服用済みの割合）
  const completionRate = useMemo(() => {
    if (todaySchedules.length === 0) return 0
    const takenCount = todayDoseLogs.filter((log) => log.isTaken).length
    return Math.round((takenCount / todaySchedules.length) * 100)
  }, [todaySchedules.length, todayDoseLogs])

  return (
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
  )
}


