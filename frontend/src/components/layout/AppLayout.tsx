import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Gamepad2,
  Trophy,
  Clock,
  Palette,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import randLogo from "@/assets/rand_single-removebg-preview.png";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Games", href: "/games", icon: Gamepad2 },
  { name: "Post Results", href: "/post-results", icon: Trophy },
  { name: "History", href: "/history", icon: Clock },
  { name: "Design Guide", href: "/design-guide", icon: Palette },
];

export function AppLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { logout, userEmail, userPicture } = useAuth();
  const navigate = useNavigate();

  const handleLogoutConfirmed = () => {
    setLogoutDialogOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const requestLogout = (fromMobile = false) => {
    if (fromMobile) {
      setMobileMenuOpen(false);
    }
    setLogoutDialogOpen(true);
  };

  const userInitial = userEmail?.charAt(0)?.toUpperCase() || "?";

  return (
    <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={randLogo} alt="Rand Lottery" className="h-10 w-10" />
              <div>
                <h1 className="font-display text-lg font-bold text-foreground">
                  Rand <span className="text-gradient-gold">Lottery</span>
                </h1>
                <p className="text-xs text-muted-foreground">Results Manager</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 md:flex">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn("gap-2", isActive && "shadow-gold")}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 h-9 w-9 rounded-full border border-border bg-card"
                  >
                    <Avatar className="h-7 w-7">
                      {userPicture ? (
                        <AvatarImage src={userPicture} alt={userEmail ?? "Account"} />
                      ) : null}
                      <AvatarFallback className="text-sm font-medium">{userInitial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="text-xs uppercase text-muted-foreground">Signed in</span>
                    <span className="font-medium leading-tight">
                      {userEmail ?? "Unknown account"}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={() => requestLogout()}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="animate-slide-up border-t border-border bg-card p-4 md:hidden">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 rounded-md border border-border bg-background/60 p-3">
                  <Avatar className="h-10 w-10">
                    {userPicture ? (
                      <AvatarImage src={userPicture} alt={userEmail ?? "Account"} />
                    ) : null}
                    <AvatarFallback className="text-base font-semibold">{userInitial}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-xs uppercase text-muted-foreground">Account</span>
                    <span className="text-sm font-medium leading-tight">
                      {userEmail ?? "Unknown account"}
                    </span>
                  </div>
                </div>
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn("w-full justify-start gap-3", isActive && "shadow-gold")}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => requestLogout(true)}
                >
                  Logout
                </Button>
              </div>
            </nav>
          )}
        </header>

        {/* Main Content */}
        <main className="container py-6 md:py-8">
          <Outlet />
        </main>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to sign back in to manage lottery results.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay signed in</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogoutConfirmed}>Sign out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
