export const Header = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-4 py-4 flex items-center justify-between max-w-screen-md mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
            D
          </div>
          <h1 className="text-lg font-light text-foreground">Dose</h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors">
          <span className="text-muted-foreground text-lg">⚙</span>
        </div>
      </div>
    </header>
  )
}
