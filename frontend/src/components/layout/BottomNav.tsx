import { Link, useRouterState } from "@tanstack/react-router";
import { History, Home, Pill, Settings } from "lucide-react";

export const BottomNav = () => {
  const router = useRouterState();
  const pathname = router.location.pathname;

  const navItems = [
    {
      href: "/",
      label: "ホーム",
      icon: Home,
    },
    {
      href: "/medicine",
      label: "薬管理",
      icon: Pill,
    },
    {
      href: "/dose-history",
      label: "履歴",
      icon: History,
    },
    {
      href: "/settings",
      label: "設定",
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="max-w-screen-md mx-auto px-0">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;
            return (
              <Link key={item.href} to={item.href}>
                <div
                  className={`flex flex-col items-center justify-center py-3 px-4 min-w-[64px] cursor-pointer transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
