import { Link, useLocation } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'

type Props = {
  remainingGenerations: number | null
  email: string | null
  onLogout: () => void
}

export function Navbar({ remainingGenerations, email, onLogout }: Props) {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:rotate-12 transition-transform">🪶</span>
            <span className="font-heading font-bold text-lg tracking-tight text-foreground">
              UseTinamou<span className="text-primary">.com</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/order-parser"
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive('/order-parser') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              Order Parser
            </Link>
            <Link
              to="/product-csv"
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                isActive('/product-csv') ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              CSV Formatter
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {email && (
            <div className="hidden sm:flex items-center gap-3">
              {remainingGenerations !== null && (
                <Badge variant={remainingGenerations > 0 ? 'secondary' : 'destructive'} className="text-xs px-2 py-0.5">
                  {remainingGenerations} left
                </Badge>
              )}
              <span className="text-xs text-muted-foreground max-w-[120px] truncate" title={email}>
                {email}
              </span>
              <button
                onClick={onLogout}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors underline underline-offset-4"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
