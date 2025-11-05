import { Card } from "@/components/ui/card"

interface TodayProgressProps {
  completionRate: number
}

export const TodayProgress = ({ completionRate }: TodayProgressProps) => {
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


