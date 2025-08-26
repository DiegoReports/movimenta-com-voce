
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Heart, 
  Play, 
  Trophy, 
  Clock, 
  Flame, 
  Target,
  TrendingUp,
  Calendar,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/next"

type WorkoutHistory = {
  id: string;
  date: string;
  activity: string;
  mood: string;
  duration: number; // em minutos
  emoji: string;
  activityIcon: string;
};

type Friend = {
  id: string;
  name: string;
  avatar: string;
  points: number;
  streak: number;
};

// Mock data
const workoutHistory: WorkoutHistory[] = [
  {
    id: "1",
    date: "2025-06-13",
    activity: "Corrida",
    mood: "Energizado",
    duration: 25,
    emoji: "⚡",
    activityIcon: "🏃‍♀️"
  },
  {
    id: "2", 
    date: "2025-06-12",
    activity: "Caminhada",
    mood: "Tranquilo",
    duration: 35,
    emoji: "😌",
    activityIcon: "🚶‍♀️"
  },
  {
    id: "3",
    date: "2025-06-11", 
    activity: "Só relaxar",
    mood: "Cansado",
    duration: 20,
    emoji: "😴",
    activityIcon: "🧘‍♀️"
  }
];

const friends: Friend[] = [
  { id: "1", name: "Ana", avatar: "A", points: 1250, streak: 7 },
  { id: "2", name: "Carlos", avatar: "C", points: 1180, streak: 5 },
  { id: "3", name: "Maria", avatar: "M", points: 980, streak: 12 },
  { id: "4", name: "João", avatar: "J", points: 850, streak: 3 },
];

const userStats = {
  name: "Você",
  points: 1100,
  streak: 4,
  rank: 3
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName] = useState("Amigo");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const sortedRanking = [...friends, userStats]
    .sort((a, b) => b.points - a.points)
    .map((user, index) => ({ ...user, position: index + 1 }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-4 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <Analytics />
          <h1 className="text-3xl font-bold text-foreground">Olá, {userName}!</h1>
          <p className="text-lg text-muted-foreground">
            Como está se sentindo hoje?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold text-foreground">{userStats.streak}</p>
              <p className="text-xs text-muted-foreground">dias seguidos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold text-foreground">#{userStats.rank}</p>
              <p className="text-xs text-muted-foreground">ranking</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-foreground">{userStats.points}</p>
              <p className="text-xs text-muted-foreground">pontos</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-xl font-bold">Pronto para se movimentar?</h3>
            <Button 
              onClick={() => navigate('/workout')}
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar Workout
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>Suas últimas sessões de bem-estar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workoutHistory.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{workout.activityIcon}</div>
                  <div>
                    <p className="font-medium text-foreground">{workout.activity}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(workout.date)}</span>
                      <Badge variant="secondary" className="text-xs">
                        {workout.emoji} {workout.mood}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{workout.duration}min</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>concluído</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ranking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Ranking dos Amigos
            </CardTitle>
            <CardDescription>Veja como você está comparado aos seus amigos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sortedRanking.map((user) => {
              const isCurrentUser = user.name === "Você";
              return (
                <div 
                  key={user.id || 'current-user'} 
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    isCurrentUser 
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm">
                      {user.position}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className={isCurrentUser ? "bg-primary text-primary-foreground" : ""}>
                        {user.name === "Você" ? "V" : (user as Friend).avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className={`font-medium ${isCurrentUser ? 'text-primary font-bold' : 'text-foreground'}`}>
                        {user.name}
                        {isCurrentUser && " (Você)"}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span>{user.streak} dias</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                      {user.points} pts
                    </p>
                    {user.position <= 3 && (
                      <Award className={`w-4 h-4 ml-auto ${
                        user.position === 1 ? 'text-yellow-500' :
                        user.position === 2 ? 'text-gray-400' : 'text-amber-600'
                      }`} />
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
