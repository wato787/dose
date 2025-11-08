import type React from "react"
import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { ChevronLeft, Pill, Clock, Calendar } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCreateMedicine } from "@/hooks/useMedicines"
import { useCreateSchedule } from "@/hooks/useSchedules"
import type { FrequencyType } from "@/types/domain"

export const Add = () => {
  const navigate = useNavigate()
  const createMedicine = useCreateMedicine()
  const createSchedule = useCreateSchedule()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    time: "09:00",
    frequency_type: "DAILY" as FrequencyType,
    start_date: new Date().toISOString().split("T")[0],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "薬の名前を入力してください"
    }
    if (!formData.time) {
      newErrors.time = "服用時間を選択してください"
    }
    if (!formData.start_date) {
      newErrors.start_date = "開始日を選択してください"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      // 薬を作成
      const medicine = await createMedicine.mutateAsync({
        name: formData.name,
        description: formData.description || null,
        isActive: true,
      })

      // スケジュールを作成
      await createSchedule.mutateAsync({
        medicineId: medicine.medicineId,
        time: formData.time,
        frequencyType: formData.frequency_type,
        startDate: new Date(formData.start_date),
      })

      // 成功後は薬一覧ページへリダイレクト
      navigate({ to: "/medicine" as any })
    } catch (error) {
      console.error("Failed to create medicine:", error)
      // エラーハンドリングは必要に応じて追加
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <Link
            to={"/medicine" as any}
            className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors inline-block"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </Link>
          <h1 className="text-lg font-medium text-foreground">薬を登録</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Medicine Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Pill className="w-4 h-4 text-primary" />
              薬の名前
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="例: ピル、降圧剤"
              className={`bg-card border-2 ${errors.name ? "border-destructive" : "border-border"}`}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">説明（任意）</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="用途や症状など、メモを入力"
              className="w-full px-3 py-2 bg-card border-2 border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              rows={3}
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary" />
              服用時間
            </label>
            <Input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`bg-card border-2 ${errors.time ? "border-destructive" : "border-border"}`}
            />
            {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
          </div>

          {/* Frequency Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">頻度</label>
            <select
              name="frequency_type"
              value={formData.frequency_type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-card border-2 border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors"
            >
              <option value="DAILY">毎日</option>
              <option value="WEEKLY">週1回</option>
              <option value="CUSTOM">カスタム</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              開始日
            </label>
            <Input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className={`bg-card border-2 ${errors.start_date ? "border-destructive" : "border-border"}`}
            />
            {errors.start_date && <p className="text-xs text-destructive">{errors.start_date}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={createMedicine.isPending || createSchedule.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-colors"
            >
              {createMedicine.isPending || createSchedule.isPending ? "登録中..." : "薬を登録"}
            </Button>
          </div>
        </form>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20 p-4 space-y-2">
          <p className="text-xs font-medium text-foreground">💡 ヒント</p>
          <p className="text-xs text-muted-foreground">
            登録後、出血などのカスタム記録項目は「設定」から追加できます。
          </p>
        </Card>
      </div>
    </main>
  )
}
