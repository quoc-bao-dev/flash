import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Star, Check } from 'lucide-react';
import { Flashcard } from '../types/flashcardTypes';
import { useThemeStore } from '../../ui/store/themeStore';

import './style.css'; // 🔺 import CSS mới thêm

interface FlashCardProps {
  flashcard: Flashcard;
  onFlip?: () => void;
  onRate?: (rating: number) => void;
  onMarkLearned?: () => void;
  showActions?: boolean;
  autoFlip?: boolean;
}

export const FlashCard: React.FC<FlashCardProps> = ({
  flashcard,
  onFlip,
  onRate,
  onMarkLearned,
  showActions = true,
  autoFlip = false,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { settings } = useThemeStore();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  const handlePlayAudio = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1000); // Mock TTS
  };

  const handleRate = (rating: number) => {
    onRate?.(rating);
  };

  const cardContainerClass = `
    relative w-full max-w-md mx-auto h-80 cursor-pointer
    ${settings.mode === 'dark' ? 'text-white' : 'text-gray-900'}
  `;

  const cardFaceBase = `
    shadow-xl transition-transform duration-500
    ${
      settings.mode === 'dark'
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
        : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
    }
  `;

  return (
    <div className="flex flex-col items-center gap-4" data-tutorial="flashcard">
      {/* Card */}
      <motion.div
        className={cardContainerClass}
        style={{ perspective: '1000px' }}
        whileHover={{ scale: settings.reduceMotion ? 1 : 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: settings.reduceMotion ? 0.1 : 0.6 }}
          style={{ transformStyle: 'preserve-3d' }}
          onClick={handleFlip}
        >
          {/* Front Side */}
          <div className={`card-face ${cardFaceBase}`}>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {flashcard.englishWord}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {flashcard.phoneticTranscription}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                {flashcard.partOfSpeech}
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayAudio();
                }}
                className="p-2 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={isPlaying}
              >
                <Volume2
                  className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`}
                />
              </motion.button>
            </div>
          </div>

          {/* Back Side */}
          <div className={`card-face card-back ${cardFaceBase}`}>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {flashcard.vietnameseTranslation}
              </h3>
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Example
                </p>
                <p className="text-base leading-relaxed">
                  {flashcard.exampleSentence}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${
                    flashcard.difficulty === 'beginner'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : flashcard.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }
                `}
                >
                  {flashcard.difficulty}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Actions */}
      {showActions && (
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <motion.button
                key={rating}
                onClick={() => handleRate(rating)}
                className={`p-1 rounded transition-colors ${
                  rating <= flashcard.starRating
                    ? 'text-yellow-500'
                    : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Star className="w-4 h-4 fill-current" />
              </motion.button>
            ))}
          </div>

          {/* Mark as Learned */}
          <motion.button
            onClick={onMarkLearned}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${
                flashcard.isLearned
                  ? 'bg-green-500 text-white'
                  : settings.mode === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-green-600 hover:text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Check className="w-4 h-4" />
            {flashcard.isLearned ? 'Learned' : 'Mark as Learned'}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
