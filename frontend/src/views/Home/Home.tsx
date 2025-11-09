import { TodayProgress } from "./TodayProgress"
import { ScheduleTime } from "./ScheduleTime"
import { DoseRecord } from "./DoseRecord"
import { CustomItems } from "./CustomItems"

export const Home = () => {
  return (
    <>
      <TodayProgress />

      <section className="px-4 py-6 space-y-4 pb-20">
        <ScheduleTime />

        <div className="space-y-3">
          <DoseRecord />
          <CustomItems />
        </div>
      </section>
    </>
  )
}
