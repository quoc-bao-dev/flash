export type LearningMode = 'flipcard' | 'quiz' | 'review';

export type QuizType = 'multiple-choice' | 'fill-blank' | 'matching';

export interface QuizQuestion {
  id: string;
  flashcardId: string;
  question: string;
  correctAnswer: string;
  options?: string[];
  type: QuizType;
}

export interface QuizSession {
  id: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  score: number;
  startTime: Date;
  endTime?: Date;
  isCompleted: boolean;
}

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LearningModeStore {
  currentMode: LearningMode;
  userLevel: UserLevel;
  currentQuizSession: QuizSession | null;
  quizHistory: QuizSession[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentMode: (mode: LearningMode) => void;
  setUserLevel: (level: UserLevel) => void;
  startQuizSession: (flashcardIds: string[], type: QuizType) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  completeQuizSession: () => void;
  resetQuizSession: () => void;
  generateQuizQuestions: (flashcardIds: string[], type: QuizType) => QuizQuestion[];
}