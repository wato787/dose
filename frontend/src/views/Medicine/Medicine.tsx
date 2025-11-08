import { Link } from "@tanstack/react-router"
import { ChevronLeft, Pill, Edit2, Trash2, Plus, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMedicines, useDeleteMedicine } from "@/hooks/useMedicines"
import { useSchedules } from "@/hooks/useSchedules"
import type { FrequencyType } from "@/types/domain"

export const Medicine = () => {
  const { data: medicinesData, isLoading: medicinesLoading } = useMedicines()
  const medicines = medicinesData?.medicines || []
  const { data: schedulesData } = useSchedules()
  const schedules = schedulesData?.schedules || []
  const deleteMedicine = useDeleteMedicine()

  const handleDelete = async (medicineId: number) => {
    if (confirm("この薬を削除しますか？")) {
      await deleteMedicine.mutateAsync(medicineId)
    }
  }

  const getFrequencyLabel = (type: FrequencyType) => {
    const labels: Record<FrequencyType, string> = {
      DAILY: "毎日",
      WEEKLY: "週1回",
      CUSTOM: "カスタム",
    }
    return labels[type] || type
  }

  const getMedicineSchedules = (medicineId: number) => {
    return schedules.filter((schedule) => schedule.medicineId === medicineId)
  }

  if (medicinesLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <Link to="/">
            <button className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
          </Link>
          <h1 className="text-lg font-medium text-foreground">薬管理</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-4 pb-24">
        {medicines.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Pill className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">まだ薬が登録されていません</p>
            <Link to={"/medicine/add" as any}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                最初の薬を登録
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Medicines List */}
            <div className="space-y-3">
              {medicines.map((medicine) => {
                const medicineSchedules = getMedicineSchedules(medicine.medicineId)
                return (
                  <Card key={medicine.medicineId} className="bg-card border-border p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground flex items-center gap-2">
                          <Pill className="w-4 h-4 text-primary" />
                          {medicine.name}
                        </h3>
                        {medicine.description && (
                          <p className="text-sm text-muted-foreground mt-1">{medicine.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={"/medicine/$id/edit" as any}
                          params={{ id: String(medicine.medicineId) } as any}
                          className="p-2 hover:bg-muted rounded-lg transition-colors inline-block"
                        >
                          <Edit2 className="w-4 h-4 text-secondary" />
                        </Link>
                        <button
                          onClick={() => handleDelete(medicine.medicineId)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          disabled={deleteMedicine.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>

                    {/* Schedules */}
                    {medicineSchedules.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-border">
                        {medicineSchedules.map((schedule) => (
                          <div key={schedule.scheduleId} className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-secondary" />
                            <span className="text-foreground font-medium">{schedule.time}</span>
                            <span className="text-muted-foreground">{getFrequencyLabel(schedule.frequencyType)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>

            {/* Add button */}
            <div className="fixed bottom-6 right-6">
              <Link
                to="/medicine/add"
                className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg flex items-center justify-center transition-colors"
              >
                <Plus className="w-6 h-6 text-primary-foreground" />
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
