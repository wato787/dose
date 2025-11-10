import { Spinner } from "@/components/ui/spinner";

export const Loading = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  );
};
