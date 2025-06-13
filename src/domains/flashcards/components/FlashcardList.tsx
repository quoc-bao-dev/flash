import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Star, Check, Search, Filter, Plus } from 'lucide-react';
import { useFlashcardStore } from '../store/flashcardStore';
import { useTopicStore } from '../../topics/store/topicStore';
import { useThemeStore } from '../../ui/store/themeStore';
import { FlashcardForm } from './FlashcardForm';
import { Flashcard } from '../types/flashcardTypes';

export const FlashcardList: React.FC = () => {
  const { settings } = useThemeStore();
  const { 
    getFilteredFlashcards, 
    deleteFlashcard, 
    updateFlashcard,
    filter,
    setFilter 
  } = useFlashcardStore();
  const { topics } = useTopicStore();
  
  const [showForm, setShowForm] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const flashcards = getFilteredFlashcards();

  const handleEdit = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this flashcard?')) {
      deleteFlashcard(id);
    }
  };

  const handleRate = (id: string, rating: number) => {
    updateFlashcard(id, { starRating: rating });
  };

  const handleToggleLearned = (id: string, isLearned: boolean) => {
    updateFlashcard(id, { isLearned: !isLearned });
  };

  const filteredFlashcards = flashcards.filter(card =>
    card.englishWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.vietnameseTranslation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Flashcard Library</h2>
        <motion.button
          onClick={() => {
            setEditingFlashcard(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          Add Flashcard
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flashcards..."
            className={`
              w-full pl-10 pr-4 py-3 rounded-lg border transition-colors
              ${settings.mode === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-500'
                : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500'
              }
              focus:outline-none focus:ring-2 focus:ring-primary-500/20
            `}
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
              ${showFilters
                ? 'bg-primary-500 text-white border-primary-500'
                : settings.mode === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="w-4 h-4" />
            Filters
          </motion.button>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredFlashcards.length} flashcard{filteredFlashcards.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`
                p-4 rounded-lg border
                ${settings.mode === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-gray-50 border-gray-200'
                }
              `}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Topic Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Topic</label>
                  <select
                    value={filter.topicId || ''}
                    onChange={(e) => setFilter({ topicId: e.target.value || undefined })}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${settings.mode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                    `}
                  >
                    <option value="">All Topics</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={filter.difficulty || ''}
                    onChange={(e) => setFilter({ difficulty: e.target.value as any || undefined })}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${settings.mode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                    `}
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Learned Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={filter.learned === undefined ? '' : filter.learned.toString()}
                    onChange={(e) => setFilter({ 
                      learned: e.target.value === '' ? undefined : e.target.value === 'true' 
                    })}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${settings.mode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                    `}
                  >
                    <option value="">All</option>
                    <option value="false">Not Learned</option>
                    <option value="true">Learned</option>
                  </select>
                </div>

                {/* Star Rating Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Min Rating</label>
                  <select
                    value={filter.starRating || ''}
                    onChange={(e) => setFilter({ starRating: e.target.value ? parseInt(e.target.value) : undefined })}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${settings.mode === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                    `}
                  >
                    <option value="">Any Rating</option>
                    <option value="1">1+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Flashcard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredFlashcards.map((flashcard, index) => (
            <motion.div
              key={flashcard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`
                p-4 rounded-xl border transition-all duration-200 hover:shadow-lg
                ${settings.mode === 'dark'
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">
                    {flashcard.englishWord}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {flashcard.phoneticTranscription}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  <motion.button
                    onClick={() => handleEdit(flashcard)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleDelete(flashcard.id)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-500"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Translation */}
              <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                {flashcard.vietnameseTranslation}
              </p>

              {/* Example */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {flashcard.exampleSentence}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${flashcard.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    flashcard.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }
                `}>
                  {flashcard.difficulty}
                </span>
                
                <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {flashcard.partOfSpeech}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <motion.button
                      key={rating}
                      onClick={() => handleRate(flashcard.id, rating)}
                      className={`
                        transition-colors
                        ${rating <= flashcard.starRating
                          ? 'text-yellow-500'
                          : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                        }
                      `}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Star className="w-3 h-3 fill-current" />
                    </motion.button>
                  ))}
                </div>

                {/* Learned Toggle */}
                <motion.button
                  onClick={() => handleToggleLearned(flashcard.id, flashcard.isLearned)}
                  className={`
                    flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors
                    ${flashcard.isLearned
                      ? 'bg-green-500 text-white'
                      : settings.mode === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-green-600 hover:text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-green-500 hover:text-white'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Check className="w-3 h-3" />
                  {flashcard.isLearned ? 'Learned' : 'Learn'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredFlashcards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            {searchQuery || Object.keys(filter).length > 0
              ? 'No flashcards match your search criteria'
              : 'No flashcards yet'
            }
          </p>
          {!searchQuery && Object.keys(filter).length === 0 && (
            <motion.button
              onClick={() => {
                setEditingFlashcard(null);
                setShowForm(true);
              }}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Your First Flashcard
            </motion.button>
          )}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <FlashcardForm
            flashcard={editingFlashcard}
            onClose={() => {
              setShowForm(false);
              setEditingFlashcard(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};