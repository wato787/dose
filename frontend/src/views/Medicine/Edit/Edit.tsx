import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "@tanstack/react-router"
import { ChevronLeft, Pill, Clock, Calendar, Plus, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMedicine, useUpdateMedicine } from "@/hooks/useMedicines"
import type { FrequencyType, CustomItemDataType } from "@/types/domain"

type CustomItemForm = {
  itemName: string
  dataType: CustomItemDataType
  isRequired: boolean
}

export const Edit = () => {
  const navigate = useNavigate()
  const { id } = useParams({ from: "/medicine/$id/edit" as any })
  const medicineId = Number(id)

  const { data: medicine, isLoading: medicineLoading } = useMedicine(medicineId)
  const schedules = medicine?.schedules || []
  const firstSchedule = schedules[0]
  const existingCustomItems = medicine?.customItems || []

  const updateMedicine = useUpdateMedicine()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    time: "09:00",
    frequency_type: "DAILY" as FrequencyType,
    start_date: new Date().toISOString().split("T")[0],
    customItems: [] as CustomItemForm[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // 薬、スケジュール、カスタムアイテムのデータをフォームに設定
  useEffect(() => {
    if (medicine) {
      setFormData((prev) => ({
        ...prev,
        name: medicine.name,
        description: medicine.description || "",
      }))
    }
    if (firstSchedule) {
      setFormData((prev) => ({
        ...prev,
        time: firstSchedule.time,
        frequency_type: firstSchedule.frequencyType,
        start_date: new Date(firstSchedule.startDate).toISOString().split("T")[0],
      }))
    }
    if (existingCustomItems.length > 0) {
      setFormData((prev) => ({
        ...prev,
        customItems: existingCustomItems.map((item) => ({
          itemName: item.itemName,
          dataType: item.dataType,
          isRequired: item.isRequired,
        })),
      }))
    }
  }, [medicine, firstSchedule, existingCustomItems])

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

    if (!validateForm() || !medicine) {
      return
    }

    try {
      // 薬、スケジュール、カスタムアイテムを統合して更新
      await updateMedicine.mutateAsync({
        id: medicine.medicineId,
        data: {
          name: formData.name,
          description: formData.description || null,
          schedule: {
            time: formData.time,
            frequencyType: formData.frequency_type,
            startDate: new Date(formData.start_date),
          },
          customItems: formData.customItems.length > 0 ? formData.customItems : [],
        },
      })

      // 成功後は一覧ページへリダイレクト
      navigate({ to: "/medicine" as any })
    } catch (error) {
      console.error("Failed to update medicine:", error)
      // エラーハンドリングは必要に応じて追加
    }
  }

  const addCustomItem = () => {
    setFormData((prev) => ({
      ...prev,
      customItems: [
        ...prev.customItems,
        {
          itemName: "",
          dataType: "BOOL" as CustomItemDataType,
          isRequired: false,
        },
      ],
    }))
  }

  const removeCustomItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customItems: prev.customItems.filter((_, i) => i !== index),
    }))
  }

  const updateCustomItem = (index: number, field: keyof CustomItemForm, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      customItems: prev.customItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  if (medicineLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!medicine) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <p className="text-foreground font-medium">薬が見つかりません</p>
          <Link to={"/medicine" as any}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">一覧に戻る</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <Link
            to={"/medicine" as any}
            className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors inline-block"
          >
              <ChevronLeft className="w-6 h-6 text-foreground" />
          </Link>
          <h1 className="text-lg font-medium text-foreground">薬を編集</h1>
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

          {/* Custom Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">カスタム記録項目（任意）</label>
              <Button
                type="button"
                onClick={addCustomItem}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <Plus className="w-4 h-4 mr-1" />
                追加
              </Button>
            </div>
            {formData.customItems.map((item, index) => (
              <Card key={index} className="p-4 space-y-3 bg-card border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">項目名</label>
                      <Input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => updateCustomItem(index, "itemName", e.target.value)}
                        placeholder="例: 出血、痛み"
                        className="bg-card border-2 border-border mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">データ型</label>
                      <select
                        value={item.dataType}
                        onChange={(e) => updateCustomItem(index, "dataType", e.target.value as CustomItemDataType)}
                        className="w-full px-3 py-2 bg-card border-2 border-border rounded-lg text-foreground focus:outline-none focus:border-primary transition-colors mt-1"
                      >
                        <option value="BOOL">はい/いいえ</option>
                        <option value="NUMBER">数値</option>
                        <option value="TEXT">テキスト</option>
                        <option value="RATING">評価（1-5）</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`required-${index}`}
                        checked={item.isRequired}
                        onChange={(e) => updateCustomItem(index, "isRequired", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor={`required-${index}`} className="text-xs text-muted-foreground">
                        必須項目
                      </label>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeCustomItem(index)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={updateMedicine.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-colors"
            >
              {updateMedicine.isPending ? "保存中..." : "変更を保存"}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
