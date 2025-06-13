import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLearningModeStore } from '../store/learningModeStore';
import { useFlashcardStore } from '../../flashcards/store/flashcardStore';
import { useThemeStore } from '../../ui/store/themeStore';

export const Quiz: React.FC = () => {
  const { settings } = useThemeStore();
  const { currentQuizSession, answerQuestion, nextQuestion, completeQuizSession } = useLearningModeStore();
  const { updateReview } = useFlashcardStore();
  
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!currentQuizSession || showResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuizSession, showResult]);

  if (!currentQuizSession) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No quiz session active</p>
      </div>
    );
  }

  const currentQuestion = currentQuizSession.questions[currentQuizSession.currentQuestionIndex];
  const isLastQuestion = currentQuizSession.currentQuestionIndex === currentQuizSession.questions.length - 1;
  const progress = ((currentQuizSession.currentQuestionIndex + 1) / currentQuizSession.questions.length) * 100;

  const handleSubmit = () => {
    if (!selectedAnswer && timeLeft > 0) return;
    
    const answer = selectedAnswer || '';
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    answerQuestion(currentQuestion.id, answer);
    updateReview(currentQuestion.flashcardId, isCorrect);
    setShowResult(true);

    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      completeQuizSession();
    } else {
      nextQuestion();
      setSelectedAnswer('');
      setShowResult(false);
      setTimeLeft(30);
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto" data-tutorial="quiz">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Question {currentQuizSession.currentQuestionIndex + 1} of {currentQuizSession.questions.length}
          </span>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span className={timeLeft <= 10 ? 'text-red-500 font-bold' : ''}>{timeLeft}s</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-primary-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className={`
          p-8 rounded-2xl mb-6 text-center
          ${settings.mode === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
          }
        `}
      >
        <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
        
        {/* Multiple Choice Options */}
        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={option}
                onClick={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
                className={`
                  w-full p-4 rounded-xl text-left transition-all duration-200
                  ${showResult
                    ? option === currentQuestion.correctAnswer
                      ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : option === selectedAnswer && !isCorrect
                        ? 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : settings.mode === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-gray-300'
                          : 'bg-gray-100 border-gray-300 text-gray-700'
                    : selectedAnswer === option
                      ? 'bg-primary-100 border-primary-500 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                      : settings.mode === 'dark'
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                  }
                  border-2 font-medium
                `}
                whileHover={{ scale: showResult ? 1 : 1.02 }}
                whileTap={{ scale: showResult ? 1 : 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && (
                    <div>
                      {option === currentQuestion.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : option === selectedAnswer && !isCorrect ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : null}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Fill in the Blank */}
        {currentQuestion.type === 'fill-blank' && (
          <div className="space-y-4">
            <input
              type="text"
              value={selectedAnswer}
              onChange={(e) => !showResult && setSelectedAnswer(e.target.value)}
              disabled={showResult}
              className={`
                w-full p-4 rounded-xl text-center text-lg font-medium border-2 transition-colors
                ${showResult
                  ? isCorrect
                    ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : settings.mode === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500'
                }
                outline-none
              `}
              placeholder="Type your answer..."
            />
            {showResult && !isCorrect && (
              <p className="text-green-600 font-medium">
                Correct answer: {currentQuestion.correctAnswer}
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {!showResult ? (
          <motion.button
            onClick={handleSubmit}
            disabled={!selectedAnswer && timeLeft > 0}
            className="px-8 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Answer
          </motion.button>
        ) : (
          <motion.button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isLastQuestion ? (
              <>
                <Award className="w-5 h-5" />
                Finish Quiz
              </>
            ) : (
              'Next Question'
            )}
          </motion.button>
        )}
      </div>

      {/* Result Feedback */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`
              mt-6 p-4 rounded-xl text-center
              ${isCorrect
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2 font-medium">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Correct! Great job!
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  Not quite right. Keep practicing!
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};