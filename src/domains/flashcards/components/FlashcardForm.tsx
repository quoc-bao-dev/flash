import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Volume2 } from 'lucide-react';
import { Flashcard, PartOfSpeech, Difficulty } from '../types/flashcardTypes';
import { useFlashcardStore } from '../store/flashcardStore';
import { useTopicStore } from '../../topics/store/topicStore';
import { useThemeStore } from '../../ui/store/themeStore';

interface FlashcardFormProps {
  flashcard?: Flashcard;
  onClose: () => void;
  onSave?: (flashcard: Flashcard) => void;
}

export const FlashcardForm: React.FC<FlashcardFormProps> = ({
  flashcard,
  onClose,
  onSave,
}) => {
  const { settings } = useThemeStore();
  const { addFlashcard, updateFlashcard } = useFlashcardStore();
  const { topics } = useTopicStore();
  
  const [formData, setFormData] = useState({
    englishWord: flashcard?.englishWord || '',
    vietnameseTranslation: flashcard?.vietnameseTranslation || '',
    partOfSpeech: flashcard?.partOfSpeech || 'noun' as PartOfSpeech,
    phoneticTranscription: flashcard?.phoneticTranscription || '',
    exampleSentence: flashcard?.exampleSentence || '',
    difficulty: flashcard?.difficulty || 'beginner' as Difficulty,
    topicId: flashcard?.topicId || 'general',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.englishWord.trim()) {
      newErrors.englishWord = 'English word is required';
    }
    
    if (!formData.vietnameseTranslation.trim()) {
      newErrors.vietnameseTranslation = 'Vietnamese translation is required';
    }
    
    if (!formData.exampleSentence.trim()) {
      newErrors.exampleSentence = 'Example sentence is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (flashcard) {
      updateFlashcard(flashcard.id, formData);
    } else {
      addFlashcard({
        ...formData,
        isLearned: false,
        starRating: 0,
        reviewCount: 0,
        easeFactor: 2.5,
        nextReviewDate: new Date(),
      });
    }
    
    onClose();
  };

  const handlePlayPronunciation = () => {
    // Mock pronunciation - in real app would use TTS API
    console.log('Playing pronunciation for:', formData.englishWord);
  };

  const inputClass = `
    w-full px-4 py-3 rounded-lg border transition-colors
    ${settings.mode === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-500'
      : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500'
    }
    focus:outline-none focus:ring-2 focus:ring-primary-500/20
  `;

  const selectClass = `
    w-full px-4 py-3 rounded-lg border transition-colors
    ${settings.mode === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-500'
      : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500'
    }
    focus:outline-none focus:ring-2 focus:ring-primary-500/20
  `;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`
          w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6
          ${settings.mode === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {flashcard ? 'Edit Flashcard' : 'Add New Flashcard'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* English Word */}
          <div>
            <label className="block text-sm font-medium mb-2">
              English Word *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.englishWord}
                onChange={(e) => setFormData({ ...formData, englishWord: e.target.value })}
                className={inputClass}
                placeholder="Enter English word"
              />
              <button
                type="button"
                onClick={handlePlayPronunciation}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            {errors.englishWord && (
              <p className="text-red-500 text-sm mt-1">{errors.englishWord}</p>
            )}
          </div>

          {/* Vietnamese Translation */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Vietnamese Translation *
            </label>
            <input
              type="text"
              value={formData.vietnameseTranslation}
              onChange={(e) => setFormData({ ...formData, vietnameseTranslation: e.target.value })}
              className={inputClass}
              placeholder="Enter Vietnamese translation"
            />
            {errors.vietnameseTranslation && (
              <p className="text-red-500 text-sm mt-1">{errors.vietnameseTranslation}</p>
            )}
          </div>

          {/* Part of Speech & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Part of Speech
              </label>
              <select
                value={formData.partOfSpeech}
                onChange={(e) => setFormData({ ...formData, partOfSpeech: e.target.value as PartOfSpeech })}
                className={selectClass}
              >
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
                <option value="adjective">Adjective</option>
                <option value="adverb">Adverb</option>
                <option value="pronoun">Pronoun</option>
                <option value="preposition">Preposition</option>
                <option value="conjunction">Conjunction</option>
                <option value="interjection">Interjection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                className={selectClass}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Phonetic Transcription */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Phonetic Transcription
            </label>
            <input
              type="text"
              value={formData.phoneticTranscription}
              onChange={(e) => setFormData({ ...formData, phoneticTranscription: e.target.value })}
              className={inputClass}
              placeholder="/ˈeksəmpl/"
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Topic
            </label>
            <select
              value={formData.topicId}
              onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
              className={selectClass}
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Example Sentence */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Example Sentence *
            </label>
            <textarea
              value={formData.exampleSentence}
              onChange={(e) => setFormData({ ...formData, exampleSentence: e.target.value })}
              className={`${inputClass} min-h-[100px] resize-none`}
              placeholder="Enter an example sentence using this word"
            />
            {errors.exampleSentence && (
              <p className="text-red-500 text-sm mt-1">{errors.exampleSentence}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save className="w-4 h-4" />
              {flashcard ? 'Update' : 'Save'} Flashcard
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};