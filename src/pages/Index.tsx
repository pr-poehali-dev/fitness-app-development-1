import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Workout {
  id: string;
  name: string;
  duration: number;
  calories: number;
  exercises: string[];
  icon: string;
  gradient: string;
}

const workouts: Workout[] = [
  {
    id: '1',
    name: 'Кардио взрыв',
    duration: 30,
    calories: 350,
    exercises: ['Бег на месте', 'Берпи', 'Прыжки', 'Скакалка', 'Jumping Jacks'],
    icon: 'Zap',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: '2',
    name: 'Силовая тренировка',
    duration: 45,
    calories: 280,
    exercises: ['Приседания', 'Отжимания', 'Планка', 'Выпады', 'Подтягивания'],
    icon: 'Dumbbell',
    gradient: 'from-blue-500 to-purple-500'
  },
  {
    id: '3',
    name: 'Йога флоу',
    duration: 40,
    calories: 180,
    exercises: ['Собака мордой вниз', 'Поза воина', 'Дерево', 'Кобра', 'Шавасана'],
    icon: 'Flower2',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: '4',
    name: 'Растяжка',
    duration: 20,
    calories: 90,
    exercises: ['Наклоны', 'Боковые растяжки', 'Скручивания', 'Растяжка ног', 'Шея'],
    icon: 'Wind',
    gradient: 'from-pink-500 to-rose-500'
  }
];

export default function Index() {
  const [isDark, setIsDark] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(65);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWorkoutActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && isWorkoutActive && selectedWorkout) {
      if (currentExerciseIndex < selectedWorkout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setTimeLeft(60);
      } else {
        setIsWorkoutActive(false);
        setSelectedWorkout(null);
        setCurrentExerciseIndex(0);
        setWeeklyGoal(Math.min(100, weeklyGoal + 15));
      }
    }
    return () => clearTimeout(timer);
  }, [isWorkoutActive, timeLeft, currentExerciseIndex, selectedWorkout, weeklyGoal]);

  const startWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsWorkoutActive(true);
    setCurrentExerciseIndex(0);
    setTimeLeft(60);
  };

  const pauseWorkout = () => {
    setIsWorkoutActive(false);
  };

  const resumeWorkout = () => {
    setIsWorkoutActive(true);
  };

  const stopWorkout = () => {
    setIsWorkoutActive(false);
    setSelectedWorkout(null);
    setCurrentExerciseIndex(0);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (selectedWorkout) {
    const progress = ((currentExerciseIndex + (60 - timeLeft) / 60) / selectedWorkout.exercises.length) * 100;
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={stopWorkout}>
              <Icon name="X" size={24} />
            </Button>
            <h2 className="text-xl font-semibold">{selectedWorkout.name}</h2>
            <div className="w-10" />
          </div>

          <Card className="overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${selectedWorkout.gradient}`} />
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted mb-4">
                  <img 
                    src={`https://cdn.poehali.dev/projects/f587d6c1-af1b-47b4-91a8-637ff1a9f4ce/files/${currentExerciseIndex % 3 === 0 ? '78123bc6-4abb-4809-a14a-89a09ab83fc7' : currentExerciseIndex % 3 === 1 ? 'aa368413-e8d8-4198-844e-a9f513ed9540' : 'c09acdce-fe84-4278-bb0e-4976074ac1c8'}.jpg`}
                    alt={selectedWorkout.exercises[currentExerciseIndex]}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-6xl font-bold text-primary">{formatTime(timeLeft)}</span>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Упражнение {currentExerciseIndex + 1} из {selectedWorkout.exercises.length}</p>
                  <h3 className="text-2xl font-bold mt-2">{selectedWorkout.exercises[currentExerciseIndex]}</h3>
                </div>

                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex flex-col gap-3">
                {isWorkoutActive ? (
                  <Button onClick={pauseWorkout} className="w-full" size="lg">
                    <Icon name="Pause" size={20} className="mr-2" />
                    Пауза
                  </Button>
                ) : (
                  <Button onClick={resumeWorkout} className="w-full" size="lg">
                    <Icon name="Play" size={20} className="mr-2" />
                    Продолжить
                  </Button>
                )}
                <Button onClick={stopWorkout} variant="outline" className="w-full" size="lg">
                  Завершить
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Icon name="Clock" size={20} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{selectedWorkout.duration}</p>
                <p className="text-xs text-muted-foreground">минут</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Icon name="Flame" size={20} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{selectedWorkout.calories}</p>
                <p className="text-xs text-muted-foreground">ккал</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Icon name="Activity" size={20} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{selectedWorkout.exercises.length}</p>
                <p className="text-xs text-muted-foreground">упражнений</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">FitFlow</h1>
            <p className="text-muted-foreground text-sm">Твой путь к здоровью</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full"
          >
            <Icon name={isDark ? 'Sun' : 'Moon'} size={20} />
          </Button>
        </div>

        <Card className="animate-scale-in">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Недельный прогресс</p>
                <p className="text-2xl font-bold">{weeklyGoal}%</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="TrendingUp" size={28} className="text-primary" />
              </div>
            </div>
            <Progress value={weeklyGoal} className="h-3" />
            <p className="text-xs text-muted-foreground">Цель: 5 тренировок в неделю</p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Выбери тренировку</h2>
          {workouts.map((workout, index) => (
            <Card
              key={workout.id}
              className="overflow-hidden cursor-pointer transition-all hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => startWorkout(workout)}
            >
              <div className={`h-1 bg-gradient-to-r ${workout.gradient}`} />
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${workout.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Icon name={workout.icon as any} size={28} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg">{workout.name}</h3>
                    <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        {workout.duration} мин
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Flame" size={14} />
                        {workout.calories} ккал
                      </span>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Статистика за месяц</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Icon name="Flame" size={20} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">2,850</p>
                    <p className="text-xs text-muted-foreground">Калорий сожжено</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Icon name="Activity" size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">18</p>
                    <p className="text-xs text-muted-foreground">Тренировок</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Icon name="Clock" size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">540</p>
                    <p className="text-xs text-muted-foreground">Минут</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Icon name="Trophy" size={20} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Достижений</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}