import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Zap, Smile, Frown, Meh, Battery, BatteryLow, Play, Pause, Square, Trophy, Clock, BarChart3, Mic } from "lucide-react";

type Mood = {
  id: string;
  emoji: string;
  label: string;
  description: string;
  color: string;
};

type Activity = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
};

type WorkoutData = {
  startTime: number;
  pausedTime: number;
  isRunning: boolean;
  isPaused: boolean;
  totalTime: number;
};

const moods: Mood[] = [
  { id: "energized", emoji: "⚡", label: "Energizado", description: "Cheio de energia!", color: "bg-yellow-100 border-yellow-300 text-yellow-800" },
  { id: "motivated", emoji: "💪", label: "Motivado", description: "Pronto para o desafio", color: "bg-green-100 border-green-300 text-green-800" },
  { id: "calm", emoji: "😌", label: "Tranquilo", description: "Em paz comigo mesmo", color: "bg-blue-100 border-blue-300 text-blue-800" },
  { id: "tired", emoji: "😴", label: "Cansado", description: "Preciso de energia", color: "bg-purple-100 border-purple-300 text-purple-800" },
  { id: "stressed", emoji: "😰", label: "Estressado", description: "Preciso relaxar", color: "bg-orange-100 border-orange-300 text-orange-800" },
  { id: "sad", emoji: "😔", label: "Triste", description: "Não tô no meu melhor", color: "bg-gray-100 border-gray-300 text-gray-800" },
];

const activities: Activity[] = [
  { id: "walk", name: "Caminhada", icon: "🚶‍♀️", description: "Vamos devagar e com calma", color: "bg-green-500 hover:bg-green-600" },
  { id: "run", name: "Corrida", icon: "🏃‍♀️", description: "Liberar endorfina!", color: "bg-blue-500 hover:bg-blue-600" },
  { id: "bike", name: "Ciclismo", icon: "🚴‍♀️", description: "Sentir o vento no rosto", color: "bg-purple-500 hover:bg-purple-600" },
  { id: "relax", name: "Só relaxar", icon: "🧘‍♀️", description: "Hoje é dia de autocuidado", color: "bg-pink-500 hover:bg-pink-600" },
];

const getMotivationalContent = (mood: string) => {
  const content = {
    energized: {
      message: "Que energia incrível! Vamos canalizar isso numa atividade que você ama? 🔥",
      tip: "Aproveite essa disposição para tentar algo novo hoje!"
    },
    motivated: {
      message: "Sinto essa motivação daqui! Bora transformar ela em movimento? 💫",
      tip: "Você está no momento perfeito para superar seus limites."
    },
    calm: {
      message: "Que tranquilidade boa! Uma atividade leve pode ser perfeita agora. ☀️",
      tip: "Mantenha esse equilíbrio com algo que te conecte com você mesmo."
    },
    tired: {
      message: "Respira fundo. Às vezes uma caminhada leve é tudo que precisamos. 🌱",
      tip: "Movimento suave pode te dar a energia que você busca."
    },
    stressed: {
      message: "Sinto que você precisa de um reset. Que tal clarear a mente? 🌊",
      tip: "O movimento pode ser seu melhor amigo para liberar essa tensão."
    },
    sad: {
      message: "Hoje tá puxado? A gente vai devagar juntos. Você não está sozinho. 🤗",
      tip: "Um passo de cada vez. O movimento pode trazer um pouquinho de luz."
    },
  };
  
  return content[mood as keyof typeof content] || content.calm;
};

const getVoiceCommand = (activity: Activity, mood: Mood, elapsedMinutes: number) => {
  const commands = {
    walk: {
      start: "Vamos começar! Respire fundo e sinta cada passo.",
      mid: "Você está indo muito bem! Continue nesse ritmo.",
      encouragement: "Cada passo é uma vitória. Continue!"
    },
    run: {
      start: "Hora de correr! Você consegue!",
      mid: "Seu corpo está liberando endorfina. Sinta essa energia!",
      encouragement: "Você é mais forte do que imagina!"
    },
    bike: {
      start: "Pedale e sinta o vento! A aventura começou!",
      mid: "Aproveite a sensação de liberdade!",
      encouragement: "Continue pedalando! Você está arrasando!"
    },
    relax: {
      start: "Hora do autocuidado. Você merece esse momento.",
      mid: "Respire profundamente e se conecte consigo mesmo.",
      encouragement: "Este tempo é seu. Aproveite cada segundo."
    }
  };

  const activityCommands = commands[activity.id as keyof typeof commands] || commands.walk;
  
  if (elapsedMinutes === 0) return activityCommands.start;
  if (elapsedMinutes % 5 === 0) return activityCommands.encouragement;
  if (elapsedMinutes >= 10) return activityCommands.mid;
  
  return activityCommands.encouragement;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'checkin' | 'content' | 'activity' | 'workout' | 'report'>('checkin');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [userName] = useState("Amigo");
  
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    startTime: 0,
    pausedTime: 0,
    isRunning: false,
    isPaused: false,
    totalTime: 0
  });
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastVoiceCommandRef = useRef<number>(-1);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Timer effect
  useEffect(() => {
    if (workoutData.isRunning && !workoutData.isPaused) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - workoutData.startTime - workoutData.pausedTime) / 1000);
        setElapsedTime(elapsed);
        
        // Voice commands every 5 minutes
        const elapsedMinutes = Math.floor(elapsed / 60);
        if (elapsedMinutes > 0 && elapsedMinutes % 5 === 0 && elapsedMinutes !== lastVoiceCommandRef.current) {
          lastVoiceCommandRef.current = elapsedMinutes;
          if (selectedActivity && selectedMood) {
            const command = getVoiceCommand(selectedActivity, selectedMood, elapsedMinutes);
            speakText(command);
          }
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [workoutData.isRunning, workoutData.isPaused, workoutData.startTime, workoutData.pausedTime, selectedActivity, selectedMood]);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setCurrentStep('content');
  };

  const handleActivitySelect = (activity: Activity) => {
    setSelectedActivity(activity);
    setCurrentStep('workout');
    
    // Start workout immediately
    const now = Date.now();
    setWorkoutData({
      startTime: now,
      pausedTime: 0,
      isRunning: true,
      isPaused: false,
      totalTime: 0
    });
    
    // Initial voice command
    if (selectedMood) {
      const command = getVoiceCommand(activity, selectedMood, 0);
      setTimeout(() => speakText(command), 1000);
    }
  };

  const handlePauseWorkout = () => {
    if (workoutData.isPaused) {
      // Resume
      const pauseDuration = Date.now() - workoutData.startTime - workoutData.pausedTime - (elapsedTime * 1000);
      setWorkoutData(prev => ({
        ...prev,
        isPaused: false,
        pausedTime: prev.pausedTime + Math.abs(pauseDuration)
      }));
      speakText("Vamos continuar! Você está indo bem!");
    } else {
      // Pause
      setWorkoutData(prev => ({
        ...prev,
        isPaused: true
      }));
      speakText("Pausa! Respire e volte quando estiver pronto.");
    }
  };

  const handleFinishWorkout = () => {
    setWorkoutData(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      totalTime: elapsedTime
    }));
    setCurrentStep('report');
    speakText("Parabéns! Você concluiu sua atividade!");
  };

  const resetApp = () => {
    setCurrentStep('checkin');
    setSelectedMood(null);
    setSelectedActivity(null);
    setWorkoutData({
      startTime: 0,
      pausedTime: 0,
      isRunning: false,
      isPaused: false,
      totalTime: 0
    });
    setElapsedTime(0);
    lastVoiceCommandRef.current = -1;
  };

  const handleVoiceCommand = () => {
    if (!selectedActivity || !selectedMood) return;
    
    setIsVoiceActive(true);
    const elapsedMinutes = Math.floor(elapsedTime / 60);
    const command = getVoiceCommand(selectedActivity, selectedMood, elapsedMinutes);
    speakText(command);
    
    // Reset animation after speech
    setTimeout(() => setIsVoiceActive(false), 3000);
  };

  const renderCheckin = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-pink-400 to-purple-500 p-4 rounded-full">
            <Heart className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Oi, {userName}!</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Como você está se sentindo hoje? Escolha o que mais combina com você agora:
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {moods.map((mood) => (
          <Card 
            key={mood.id} 
            className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-blue-300"
            onClick={() => handleMoodSelect(mood)}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl">{mood.emoji}</div>
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-800">{mood.label}</h3>
                <p className="text-sm text-gray-600">{mood.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (!selectedMood) return null;
    
    const content = getMotivationalContent(selectedMood.id);
    
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Badge className={`text-lg px-4 py-2 ${selectedMood.color}`}>
            {selectedMood.emoji} {selectedMood.label}
          </Badge>
          <div className="max-w-md mx-auto">
            <p className="text-xl text-gray-700 leading-relaxed mb-4">
              {content.message}
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-blue-800 font-medium">{content.tip}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => setCurrentStep('activity')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-full"
          >
            Vamos nessa! ✨
          </Button>
        </div>
      </div>
    );
  };

  const renderActivity = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">O que seu corpo está pedindo?</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Escolha a atividade que mais faz sentido para você hoje:
        </p>
      </div>

      <div className="grid gap-4 max-w-lg mx-auto">
        {activities.map((activity) => (
          <Card 
            key={activity.id} 
            className="cursor-pointer transition-all duration-200 hover:scale-102 hover:shadow-lg border-2 hover:border-blue-300"
            onClick={() => handleActivitySelect(activity)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{activity.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{activity.name}</h3>
                  <p className="text-gray-600">{activity.description}</p>
                </div>
                <div className="text-blue-500">→</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWorkout = () => {
    if (!selectedActivity || !selectedMood) return null;

    return (
      <div className="space-y-8 max-w-md mx-auto">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-br from-green-400 to-blue-500 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <div className="text-4xl">{selectedActivity.icon}</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{selectedActivity.name}</h2>
          <Badge className={`${selectedMood.color} text-base px-3 py-1`}>
            {selectedMood.emoji} {selectedMood.label}
          </Badge>
        </div>

        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <Clock className="w-8 h-8 mx-auto text-blue-600" />
              <div className="text-5xl font-bold text-gray-800">
                {formatTime(elapsedTime)}
              </div>
              <p className="text-gray-600">
                {workoutData.isPaused ? "Pausado" : "Em andamento"}
              </p>
            </div>

            <div className="flex gap-4 justify-center items-center">
              <Button
                onClick={handlePauseWorkout}
                size="lg"
                variant={workoutData.isPaused ? "default" : "outline"}
                className="flex-1 max-w-32 h-16 text-lg"
              >
                {workoutData.isPaused ? (
                  <>
                    <Play className="w-6 h-6 mr-2" />
                    Continuar
                  </>
                ) : (
                  <>
                    <Pause className="w-6 h-6 mr-2" />
                    Pausar
                  </>
                )}
              </Button>

              {/* Voice Command Button */}
              <Button
                onClick={handleVoiceCommand}
                size="lg"
                variant="outline"
                className={`w-16 h-16 rounded-full transition-all duration-300 ${
                  isVoiceActive 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400 scale-110 animate-pulse' 
                    : 'hover:bg-purple-50 hover:border-purple-300 hover:scale-105'
                }`}
              >
                <Mic className={`w-6 h-6 transition-all duration-300 ${
                  isVoiceActive ? 'animate-bounce text-white' : 'text-purple-600'
                }`} />
              </Button>

              <Button
                onClick={handleFinishWorkout}
                size="lg"
                className="flex-1 max-w-32 h-16 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Square className="w-6 h-6 mr-2" />
                Concluir
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600 max-w-xs mx-auto">
            {selectedActivity.id === 'relax' 
              ? "Aproveite este momento de autocuidado. Respire fundo e se conecte consigo mesmo." 
              : "Mantenha o ritmo! Cada movimento é uma vitória."}
          </p>
          
          {/* Voice Instructions */}
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 max-w-xs mx-auto">
            <div className="flex items-center justify-center gap-2 text-purple-700">
              <Mic className="w-4 h-4" />
              <span className="text-xs font-medium">
                Toque no microfone para ouvir estímulos motivacionais
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReport = () => {
    if (!selectedMood || !selectedActivity) return null;

    const minutes = Math.floor(workoutData.totalTime / 60);
    const seconds = workoutData.totalTime % 60;

    return (
      <div className="space-y-8 max-w-md mx-auto">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Parabéns!</h2>
          <p className="text-gray-600">Você concluiu sua atividade!</p>
        </div>

        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Resumo da Sessão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Atividade</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">{selectedActivity.icon}</span>
                  <span className="font-semibold">{selectedActivity.name}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Tempo Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {minutes}m {seconds}s
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Humor inicial:</span>
                <Badge className={`${selectedMood.color} text-xs`}>
                  {selectedMood.emoji} {selectedMood.label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardContent className="p-6 text-center space-y-4">
            <div className="animate-pulse">
              <Zap className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <p className="font-semibold text-purple-800">Gerando insights personalizados...</p>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>🧠 Analisando seu humor e performance</p>
              <p>📊 Calculando recomendações com IA</p>
              <p>✨ Preparando próximas sugestões</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 text-center">
          <p className="text-gray-700 font-medium">
            {selectedActivity.id === 'relax' 
              ? "Que momento especial de autocuidado! Você investiu em seu bem-estar." 
              : `Incrível! Você se movimentou por ${minutes > 0 ? `${minutes} minutos` : `${seconds} segundos`}. Cada passo conta!`}
          </p>
          
          <Button 
            onClick={resetApp}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-full"
          >
            Nova Sessão 🔄
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {currentStep === 'checkin' && renderCheckin()}
        {currentStep === 'content' && renderContent()}
        {currentStep === 'activity' && renderActivity()}
        {currentStep === 'workout' && renderWorkout()}
        {currentStep === 'report' && renderReport()}
      </div>
    </div>
  );
};

export default Index;
