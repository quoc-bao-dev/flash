import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { useTutorialStore } from '../store/tutorialStore';
import { useThemeStore } from '../../ui/store/themeStore';

export const TutorialOverlay: React.FC = () => {
  const { settings } = useThemeStore();
  const { 
    currentFlow, 
    isActive, 
    nextStep, 
    previousStep, 
    skipTutorial, 
    completeTutorial 
  } = useTutorialStore();

  if (!isActive || !currentFlow) return null;

  const currentStep = currentFlow.steps[currentFlow.currentStepIndex];
  const isFirstStep = currentFlow.currentStepIndex === 0;
  const isLastStep = currentFlow.currentStepIndex === currentFlow.steps.length - 1;

  const getTargetElement = () => {
    if (currentStep.target === 'body') return document.body;
    return document.querySelector(currentStep.target);
  };

  const targetElement = getTargetElement();
  const targetRect = targetElement?.getBoundingClientRect();

  const getOverlayPosition = () => {
    if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const { top, left, width, height } = targetRect;
    const padding = 20;

    switch (currentStep.position) {
      case 'top':
        return {
          top: top - padding,
          left: left + width / 2,
          transform: 'translate(-50%, -100%)',
        };
      case 'bottom':
        return {
          top: top + height + padding,
          left: left + width / 2,
          transform: 'translate(-50%, 0)',
        };
      case 'left':
        return {
          top: top + height / 2,
          left: left - padding,
          transform: 'translate(-100%, -50%)',
        };
      case 'right':
        return {
          top: top + height / 2,
          left: left + width + padding,
          transform: 'translate(0, -50%)',
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
    }
  };

  const overlayPosition = getOverlayPosition();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 pointer-events-none"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Highlight target element */}
        {targetRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute border-4 border-primary-500 rounded-lg shadow-lg"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
            }}
          />
        )}

        {/* Tutorial Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className={`
            absolute pointer-events-auto max-w-sm p-6 rounded-2xl shadow-2xl
            ${settings.mode === 'dark'
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-gray-200'
            }
          `}
          style={overlayPosition}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Step {currentFlow.currentStepIndex + 1} of {currentFlow.steps.length}
              </span>
            </div>
            <button
              onClick={skipTutorial}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">{currentStep.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-primary-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${((currentFlow.currentStepIndex + 1) / currentFlow.steps.length) * 100}%` 
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isFirstStep && (
                <motion.button
                  onClick={previousStep}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </motion.button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={skipTutorial}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SkipForward className="w-4 h-4" />
                Skip
              </motion.button>

              <motion.button
                onClick={isLastStep ? completeTutorial : nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};