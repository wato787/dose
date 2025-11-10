import { Pill } from "lucide-react";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useCreateDoseLog, useDoseLogs, useUpdateDoseLog } from "@/hooks/useDoseLogs";
import { useMedicines } from "@/hooks/useMedicines";

export const DoseRecord = () => {
  const { data: medicinesData } = useMedicines({ isActive: true });
  const medicines = medicinesData?.medicines || [];

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const { data: doseLogsData } = useDoseLogs();
  const doseLogs = doseLogsData?.doseLogs || [];

  const createDoseLog = useCreateDoseLog();
  const updateDoseLog = useUpdateDoseLog();

  // 本日の最初のスケジュールとその薬、服用ログを取得
  const allSchedules = medicines.flatMap((m) => m.schedules || []);
  const todaySchedule = useMemo(() => {
    return allSchedules
      .filter((schedule) => {
        const startDate = new Date(schedule.startDate);
        startDate.setHours(0, 0, 0, 0);
        return startDate <= today;
      })
      .sort((a, b) => a.time.localeCompare(b.time))[0];
  }, [allSchedules, today]);

  const medicine = useMemo(() => {
    if (!todaySchedule) return null;
    return medicines.find((m) => m.medicineId === todaySchedule.medicineId);
  }, [todaySchedule, medicines]);

  const doseLog = useMemo(() => {
    if (!todaySchedule) return null;
    return doseLogs.find((log) => {
      const logDate = new Date(log.recordDate);
      logDate.setHours(0, 0, 0, 0);
      return log.scheduleId === todaySchedule.scheduleId && logDate.getTime() === today.getTime();
    });
  }, [todaySchedule, doseLogs, today]);

  const handleToggle = async () => {
    if (!todaySchedule || !medicine) return;

    const isTaken = !doseLog?.isTaken;
    const takenAt = isTaken ? new Date() : null;

    if (doseLog) {
      // 既存のログを更新
      await updateDoseLog.mutateAsync({
        id: doseLog.doseLogId,
        data: {
          isTaken,
          takenAt,
        },
      });
    } else {
      // 新しいログを作成
      await createDoseLog.mutateAsync({
        scheduleId: todaySchedule.scheduleId,
        recordDate: today,
        isTaken,
        takenAt,
      });
    }
  };

  if (!medicine || !todaySchedule) {
    return null;
  }

  return (
    <Card
      className={`p-4 cursor-pointer transition-all border-2 ${
        doseLog?.isTaken
          ? "bg-primary/5 border-primary/30"
          : "border-border hover:border-primary/20"
      }`}
      onClick={handleToggle}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Pill className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-foreground">{medicine.name}</p>
          </div>
          {medicine.description && (
            <p className="text-xs text-muted-foreground mt-1">{medicine.description}</p>
          )}
        </div>
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            doseLog?.isTaken ? "bg-primary border-primary" : "border-muted-foreground"
          }`}
        >
          {doseLog?.isTaken && (
            <svg
              className="w-4 h-4 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </Card>
  );
};
