interface ScheduleTimeProps {
  time: string
}

export const ScheduleTime = ({ time }: ScheduleTimeProps) => {
  return (
    <div className="flex items-center gap-3">
      <p className="text-lg font-medium text-foreground min-w-fit">{time}</p>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}


