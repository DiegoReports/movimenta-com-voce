
import { Button } from "@/components/ui/button";
import { Home, Play, Trophy, User, Sun, Moon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/ThemeProvider";

export function MobileMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Play, label: "Workout", path: "/workout" },
    { icon: Trophy, label: "Ranking", path: "/ranking" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
        
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-muted-foreground hover:text-foreground"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 transition-transform" />
          ) : (
            <Sun className="w-5 h-5 transition-transform" />
          )}
          <span className="text-xs font-medium">Tema</span>
        </Button>
      </div>
    </div>
  );
}
