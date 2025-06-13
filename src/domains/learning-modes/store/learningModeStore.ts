import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LearningModeStore, QuizSession, QuizQuestion, QuizType, UserLevel } from '../types/learningModeTypes';
import { useFlashcardStore } from '../../flashcards/store/flashcardStore';

export const useLearningModeStore = create<LearningModeStore>()(
  persist(
    (set, get) => ({
      currentMode: 'flipcard',
      userLevel: 'beginner',
      currentQuizSession: null,
      quizHistory: [],
      isLoading: false,
      error: null,

      setCurrentMode: (mode) => {
        set({ currentMode: mode });
      },

      setUserLevel: (level) => {
        set({ userLevel: level });
      },

      startQuizSession: (flashcardIds, type) => {
        const questions = get().generateQuizQuestions(flashcardIds, type);
        const session: QuizSession = {
          id: Date.now().toString(),
          questions,
          currentQuestionIndex: 0,
          answers: {},
          score: 0,
          startTime: new Date(),
          isCompleted: false,
        };
        set({ currentQuizSession: session });
      },

      answerQuestion: (questionId, answer) => {
        set((state) => {
          if (!state.currentQuizSession) return state;
          
          const updatedSession = {
            ...state.currentQuizSession,
            answers: {
              ...state.currentQuizSession.answers,
              [questionId]: answer,
            },
          };
          
          return { currentQuizSession: updatedSession };
        });
      },

      nextQuestion: () => {
        set((state) => {
          if (!state.currentQuizSession) return state;
          
          const updatedSession = {
            ...state.currentQuizSession,
            currentQuestionIndex: Math.min(
              state.currentQuizSession.currentQuestionIndex + 1,
              state.currentQuizSession.questions.length - 1
            ),
          };
          
          return { currentQuizSession: updatedSession };
        });
      },

      completeQuizSession: () => {
        set((state) => {
          if (!state.currentQuizSession) return state;
          
          // Calculate score
          let score = 0;
          state.currentQuizSession.questions.forEach((question) => {
            const userAnswer = state.currentQuizSession!.answers[question.id];
            if (userAnswer === question.correctAnswer) {
              score++;
            }
          });
          
          const completedSession: QuizSession = {
            ...state.currentQuizSession,
            score,
            endTime: new Date(),
            isCompleted: true,
          };
          
          return {
            currentQuizSession: null,
            quizHistory: [...state.quizHistory, completedSession],
          };
        });
      },

      resetQuizSession: () => {
        set({ currentQuizSession: null });
      },

      generateQuizQuestions: (flashcardIds, type) => {
        const flashcards = useFlashcardStore.getState().flashcards;
        const selectedCards = flashcards.filter((card) => flashcardIds.includes(card.id));
        
        return selectedCards.map((card): QuizQuestion => {
          switch (type) {
            case 'multiple-choice':
              // Get random incorrect options
              const otherCards = flashcards.filter((c) => c.id !== card.id);
              const incorrectOptions = otherCards
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map((c) => c.vietnameseTranslation);
              
              const options = [card.vietnameseTranslation, ...incorrectOptions]
                .sort(() => 0.5 - Math.random());
              
              return {
                id: `${card.id}-mc`,
                flashcardId: card.id,
                question: `What does "${card.englishWord}" mean?`,
                correctAnswer: card.vietnameseTranslation,
                options,
                type: 'multiple-choice',
              };
              
            case 'fill-blank':
              const sentence = card.exampleSentence.replace(
                new RegExp(card.englishWord, 'gi'),
                '_____'
              );
              return {
                id: `${card.id}-fb`,
                flashcardId: card.id,
                question: `Fill in the blank: ${sentence}`,
                correctAnswer: card.englishWord,
                type: 'fill-blank',
              };
              
            case 'matching':
              return {
                id: `${card.id}-match`,
                flashcardId: card.id,
                question: card.englishWord,
                correctAnswer: card.vietnameseTranslation,
                type: 'matching',
              };
              
            default:
              return {
                id: `${card.id}-default`,
                flashcardId: card.id,
                question: card.englishWord,
                correctAnswer: card.vietnameseTranslation,
                type: 'multiple-choice',
              };
          }
        });
      },
    }),
    {
      name: 'learning-mode-storage',
    }
  )
);