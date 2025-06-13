
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Zap, Smile, Frown, Meh, Battery, BatteryLow } from "lucide-react";

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

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'checkin' | 'content' | 'activity' | 'summary'>('checkin');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [userName] = useState("Amigo"); // In a real app, this would come from user profile

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setCurrentStep('content');
  };

  const handleActivitySelect = (activity: Activity) => {
    setSelectedActivity(activity);
    setCurrentStep('summary');
  };

  const resetApp = () => {
    setCurrentStep('checkin');
    setSelectedMood(null);
    setSelectedActivity(null);
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

  const renderSummary = () => {
    if (!selectedMood || !selectedActivity) return null;
    
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-br from-green-400 to-blue-500 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Combinação perfeita!</h2>
        </div>

        <Card className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardContent className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <Badge className={`${selectedMood.color} text-base px-3 py-1`}>
                {selectedMood.emoji} {selectedMood.label}
              </Badge>
              <div className="text-2xl">+</div>
              <div className="text-2xl">{selectedActivity.icon}</div>
              <h3 className="font-semibold text-lg text-gray-800">{selectedActivity.name}</h3>
            </div>
            
            <Separator />
            
            <div className="text-center space-y-3">
              <p className="text-gray-700 font-medium">
                {selectedActivity.id === 'relax' 
                  ? "Autocuidado também é exercício! Você merece esse momento." 
                  : "Você está fazendo algo incrível por você mesmo hoje!"}
              </p>
              <p className="text-sm text-gray-600">
                Lembre-se: não existe movimento pequeno demais. O importante é começar. 💙
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <Button 
            onClick={resetApp}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-3 text-lg rounded-full"
          >
            Começar novamente 🔄
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
        {currentStep === 'summary' && renderSummary()}
      </div>
    </div>
  );
};

export default Index;
