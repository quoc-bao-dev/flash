import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TutorialStore, TutorialFlow, TutorialStep } from '../types/tutorialTypes';

const introSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to English Learning App!',
    description: 'Let\'s take a quick tour to get you started with learning vocabulary effectively.',
    target: 'body',
    position: 'top',
    optional: false,
  },
  {
    id: 'topics',
    title: 'Choose Your Topics',
    description: 'Select topics that interest you. We have categories like Food, Travel, Business, and more!',
    target: '[data-tutorial="topics"]',
    position: 'bottom',
    optional: false,
  },
  {
    id: 'flashcards',
    title: 'Learn with Flashcards',
    description: 'Click on flashcards to flip them and see translations, phonetics, and example sentences.',
    target: '[data-tutorial="flashcard"]',
    position: 'top',
    action: 'click',
    optional: false,
  },
  {
    id: 'quiz',
    title: 'Test Your Knowledge',
    description: 'Take quizzes to reinforce your learning and track your progress.',
    target: '[data-tutorial="quiz"]',
    position: 'left',
    optional: false,
  },
  {
    id: 'stats',
    title: 'Track Your Progress',
    description: 'Monitor your learning statistics, streaks, and achievements.',
    target: '[data-tutorial="stats"]',
    position: 'right',
    optional: false,
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Start learning and unlock badges as you progress. Good luck!',
    target: 'body',
    position: 'top',
    optional: false,
  },
];

const defaultFlows: TutorialFlow[] = [
  {
    id: 'intro',
    name: 'Getting Started',
    description: 'Learn the basics of using the English Learning App',
    steps: introSteps,
    isCompleted: false,
    currentStepIndex: 0,
  },
];

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set, get) => ({
      flows: defaultFlows,
      currentFlow: null,
      isActive: false,
      showOnFirstVisit: true,
      hasCompletedIntro: false,

      startTutorial: (flowId) => {
        const flow = get().flows.find((f) => f.id === flowId);
        if (flow) {
          set({
            currentFlow: { ...flow, currentStepIndex: 0 },
            isActive: true,
          });
        }
      },

      nextStep: () => {
        set((state) => {
          if (!state.currentFlow) return state;
          
          const nextIndex = state.currentFlow.currentStepIndex + 1;
          if (nextIndex >= state.currentFlow.steps.length) {
            get().completeTutorial();
            return state;
          }
          
          return {
            currentFlow: {
              ...state.currentFlow,
              currentStepIndex: nextIndex,
            },
          };
        });
      },

      previousStep: () => {
        set((state) => {
          if (!state.currentFlow) return state;
          
          const prevIndex = Math.max(0, state.currentFlow.currentStepIndex - 1);
          return {
            currentFlow: {
              ...state.currentFlow,
              currentStepIndex: prevIndex,
            },
          };
        });
      },

      skipTutorial: () => {
        set({
          currentFlow: null,
          isActive: false,
        });
      },

      completeTutorial: () => {
        set((state) => {
          const updatedFlows = state.flows.map((flow) =>
            flow.id === state.currentFlow?.id
              ? { ...flow, isCompleted: true }
              : flow
          );
          
          return {
            flows: updatedFlows,
            currentFlow: null,
            isActive: false,
            hasCompletedIntro: state.currentFlow?.id === 'intro' ? true : state.hasCompletedIntro,
          };
        });
      },

      resetTutorial: (flowId) => {
        set((state) => ({
          flows: state.flows.map((flow) =>
            flow.id === flowId
              ? { ...flow, isCompleted: false, currentStepIndex: 0 }
              : flow
          ),
        }));
      },

      setShowOnFirstVisit: (show) => {
        set({ showOnFirstVisit: show });
      },

      markIntroCompleted: () => {
        set({ hasCompletedIntro: true });
      },
    }),
    {
      name: 'tutorial-storage',
    }
  )
);