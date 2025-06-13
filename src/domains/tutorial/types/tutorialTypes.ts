export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector or element ID
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'focus';
  optional: boolean;
}

export interface TutorialFlow {
  id: string;
  name: string;
  description: string;
  steps: TutorialStep[];
  isCompleted: boolean;
  currentStepIndex: number;
}

export interface TutorialStore {
  flows: TutorialFlow[];
  currentFlow: TutorialFlow | null;
  isActive: boolean;
  showOnFirstVisit: boolean;
  hasCompletedIntro: boolean;
  
  // Actions
  startTutorial: (flowId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  resetTutorial: (flowId: string) => void;
  setShowOnFirstVisit: (show: boolean) => void;
  markIntroCompleted: () => void;
}