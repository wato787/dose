import { CustomItem } from "../CustomItem"
import { useCustomItems } from "@/hooks/useCustomItems"
import { useCustomLogs, useCreateCustomLog, useUpdateCustomLog } from "@/hooks/useCustomLogs"
import { useSchedules } from "@/hooks/useSchedules"
import { useMemo } from "react"

export const CustomItems = () => {
  const { data: schedulesData } = useSchedules()
  const schedules = schedulesData?.schedules || []

  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  // 本日の最初のスケジュールの薬IDを取得
  const todayMedicineId = useMemo(() => {
    const todaySchedule = schedules
      .filter((schedule) => {
        const startDate = new Date(schedule.startDate)
        startDate.setHours(0, 0, 0, 0)
        return startDate <= today
      })
      .sort((a, b) => a.time.localeCompare(b.time))[0]

    return todaySchedule?.medicineId
  }, [schedules, today])

  const { data: customItemsData } = useCustomItems(
    todayMedicineId ? { medicineId: todayMedicineId } : undefined
  )
  const customItems = customItemsData?.customItems || []

  const { data: customLogsData } = useCustomLogs()
  const customLogs = customLogsData?.customLogs || []

  const createCustomLog = useCreateCustomLog()
  const updateCustomLog = useUpdateCustomLog()

  // 本日のカスタムログを取得
  const todayCustomLogs = useMemo(() => {
    return customLogs.filter((log) => {
      const logDate = new Date(log.recordDate)
      logDate.setHours(0, 0, 0, 0)
      return logDate.getTime() === today.getTime()
    })
  }, [customLogs, today])

  const handleToggle = async (customItemId: number) => {
    const existingLog = todayCustomLogs.find((log) => log.customItemId === customItemId)
    const currentValue = existingLog?.value === "true"
    const newValue = !currentValue

    if (existingLog) {
      // 既存のログを更新
      await updateCustomLog.mutateAsync({
        id: existingLog.customLogId,
        data: {
          value: String(newValue),
        },
      })
    } else {
      // 新しいログを作成
      await createCustomLog.mutateAsync({
        customItemId,
        recordDate: today,
        value: String(newValue),
      })
    }
  }

  if (customItems.length === 0) return null

  return (
    <div className="space-y-2 pl-2 border-l-2 border-primary/20">
      <p className="text-xs font-medium text-muted-foreground">追加記録項目</p>
      {customItems.map((item) => {
        const log = todayCustomLogs.find((l) => l.customItemId === item.customItemId)
        const isChecked = log?.value === "true"

        return (
          <CustomItem
            key={item.customItemId}
            item={{
              custom_item_id: item.customItemId,
              medicine_id: item.medicineId || 0,
              item_name: item.itemName,
              data_type: item.dataType,
              is_required: item.isRequired,
            }}
            isChecked={isChecked}
            onToggle={() => handleToggle(item.customItemId)}
          />
        )
      })}
    </div>
  )
}

