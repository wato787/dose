import { useSession, useSignOut } from "@/hooks/useSession"
import { Button } from "@/components/ui/button"

export const Header = () => {
  const { data: session } = useSession()
  const { mutate: signOut, isPending } = useSignOut()

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-4 py-4 flex items-center justify-between max-w-screen-md mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
            D
          </div>
          <h1 className="text-lg font-light text-foreground">Dose</h1>
        </div>
        <div className="flex items-center gap-2">
          {session?.user && (
            <>
              <span className="text-sm text-muted-foreground">{session.user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                disabled={isPending}
              >
                {isPending ? "ログアウト中..." : "ログアウト"}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
