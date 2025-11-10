import { CustomItems } from "./CustomItems";
import { DoseRecord } from "./DoseRecord";
import { ScheduleTime } from "./ScheduleTime";
import { TodayProgress } from "./TodayProgress";

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
  );
};
