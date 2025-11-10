import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  backTo: string;
};

export const PageHeader = ({ title, backTo }: PageHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-4">
        <Link to={backTo}>
          <button className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
        </Link>
        <h1 className="text-lg font-medium text-foreground">{title}</h1>
        <div className="w-10" />
      </div>
    </div>
  );
};
