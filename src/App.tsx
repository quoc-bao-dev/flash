import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './domains/ui/components/Layout';
import { TopicGrid } from './domains/topics/components/TopicGrid';
import { FlashCard } from './domains/flashcards/components/FlashCard';
import { FlashcardList } from './domains/flashcards/components/FlashcardList';
import { Quiz } from './domains/learning-modes/components/Quiz';
import { StatsOverview } from './domains/stats/components/StatsOverview';
import { BadgeDisplay } from './domains/gamification/components/BadgeDisplay';
import { AchievementDisplay } from './domains/gamification/components/AchievementDisplay';
import { TutorialOverlay } from './domains/tutorial/components/TutorialOverlay';
import { SettingsPanel } from './domains/settings/components/SettingsPanel';
import { useTopicStore } from './domains/topics/store/topicStore';
import { useFlashcardStore } from './domains/flashcards/store/flashcardStore';
import { useLearningModeStore } from './domains/learning-modes/store/learningModeStore';
import { useThemeStore } from './domains/ui/store/themeStore';
import { useTutorialStore } from './domains/tutorial/store/tutorialStore';
import { useGamificationStore } from './domains/gamification/store/gamificationStore';
import { useStorageStore } from './domains/storage/store/storageStore';
import {
  BookOpen,
  Brain,
  Play,
  RotateCcw,
  Settings,
  Plus,
  List,
} from 'lucide-react';
import { useAppStore } from './domains/ui/store/appStore';

function App() {
  // const [currentView, setCurrentView] = useState('dashboard');

  const currentView = useAppStore((s) => s.state.currPage);
  const setCurrentView = useAppStore((s) => s.setPage);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

  const { topics, selectedTopic, setSelectedTopic } = useTopicStore();
  const { getFilteredFlashcards, updateFlashcard, markAsLearned, setFilter } =
    useFlashcardStore();
  const { currentMode, setCurrentMode, startQuizSession, currentQuizSession } =
    useLearningModeStore();
  const { settings } = useThemeStore();
  const { startTutorial, showOnFirstVisit, hasCompletedIntro } =
    useTutorialStore();
  const { badges, achievements } = useGamificationStore();
  const { initializeStorage } = useStorageStore();

  // Initialize storage and theme on mount
  useEffect(() => {
    initializeStorage();
    if (settings.mode === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Show tutorial for first-time users
  useEffect(() => {
    if (showOnFirstVisit && !hasCompletedIntro) {
      setTimeout(() => startTutorial('intro'), 1000);
    }
  }, [showOnFirstVisit, hasCompletedIntro, startTutorial]);

  // Update flashcard filter when topic changes
  useEffect(() => {
    if (selectedTopic) {
      setFilter({ topicId: selectedTopic.id });
    } else {
      setFilter({});
    }
  }, [selectedTopic, setFilter]);

  const filteredFlashcards = getFilteredFlashcards();
  const currentFlashcard = filteredFlashcards[currentFlashcardIndex];

  const handleTopicSelect = (topic: any) => {
    setSelectedTopic(selectedTopic?.id === topic.id ? null : topic);
    setCurrentFlashcardIndex(0);
  };

  const handleFlashcardRate = (rating: number) => {
    if (currentFlashcard) {
      updateFlashcard(currentFlashcard.id, { starRating: rating });
    }
  };

  const handleMarkLearned = () => {
    if (currentFlashcard) {
      markAsLearned(currentFlashcard.id);
    }
  };

  const handleNextFlashcard = () => {
    setCurrentFlashcardIndex((prev) =>
      prev < filteredFlashcards.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevFlashcard = () => {
    setCurrentFlashcardIndex((prev) =>
      prev > 0 ? prev - 1 : filteredFlashcards.length - 1
    );
  };

  const startQuiz = (
    type: 'multiple-choice' | 'fill-blank' | 'matching' = 'multiple-choice'
  ) => {
    const flashcardIds = filteredFlashcards.slice(0, 10).map((card) => card.id);
    if (flashcardIds.length > 0) {
      startQuizSession(flashcardIds, type);
      setCurrentMode('quiz');
      setCurrentView('learning');
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
          Welcome to English Learning
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Master English vocabulary with interactive flashcards, spaced
          repetition, and engaging quizzes. Start your learning journey today!
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.button
          onClick={() => setCurrentView('flashcards')}
          className={`
            p-6 rounded-2xl text-left transition-all duration-200 hover:shadow-lg
            ${
              settings.mode === 'dark'
                ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }
          `}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <BookOpen className="w-12 h-12 text-primary-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Study Flashcards</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Learn new words with interactive flashcards
          </p>
        </motion.button>

        <motion.button
          onClick={() => setCurrentView('library')}
          className={`
            p-6 rounded-2xl text-left transition-all duration-200 hover:shadow-lg
            ${
              settings.mode === 'dark'
                ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }
          `}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <List className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Manage Library</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add, edit, and organize your flashcards
          </p>
        </motion.button>

        <motion.button
          onClick={() => startQuiz()}
          className={`
            p-6 rounded-2xl text-left transition-all duration-200 hover:shadow-lg
            ${
              settings.mode === 'dark'
                ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }
          `}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Brain className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Take Quiz</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Test your knowledge with interactive quizzes
          </p>
        </motion.button>

        <motion.button
          onClick={() => setCurrentView('stats')}
          className={`
            p-6 rounded-2xl text-left transition-all duration-200 hover:shadow-lg
            ${
              settings.mode === 'dark'
                ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }
          `}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Settings className="w-12 h-12 text-purple-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">View Progress</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning statistics and achievements
          </p>
        </motion.button>
      </div>

      {/* Recent Topics */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Choose Your Topics</h2>
        <TopicGrid
          topics={topics.slice(0, 6)}
          selectedTopic={selectedTopic}
          onSelectTopic={handleTopicSelect}
        />
      </div>
    </div>
  );

  const renderTopics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Learning Topics</h1>
        {selectedTopic && (
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTopic(null)}
          >
            {/* <Plus className="w-4 h-4" /> */}
            Clear Selected Topic
          </motion.button>
        )}
      </div>
      <TopicGrid
        topics={topics}
        selectedTopic={selectedTopic}
        onSelectTopic={handleTopicSelect}
      />
    </div>
  );

  const renderFlashcards = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Flashcard Study</h1>
        {selectedTopic && (
          <p className="text-gray-600 dark:text-gray-400">
            Studying: {selectedTopic.name} ({filteredFlashcards.length} cards)
          </p>
        )}
      </div>

      {currentFlashcard ? (
        <div className="space-y-6">
          <FlashCard
            flashcard={currentFlashcard}
            onRate={handleFlashcardRate}
            onMarkLearned={handleMarkLearned}
          />

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <motion.button
              onClick={handlePrevFlashcard}
              className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentFlashcardIndex + 1} / {filteredFlashcards.length}
            </span>

            <motion.button
              onClick={handleNextFlashcard}
              className="p-3 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {selectedTopic
              ? 'No flashcards available for this topic'
              : 'Select a topic to start studying'}
          </p>
        </div>
      )}
    </div>
  );

  const renderLibrary = () => (
    <div className="space-y-6">
      <FlashcardList />
    </div>
  );

  const renderLearning = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Learning Mode</h1>

        {!currentQuizSession && (
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.button
              onClick={() => setCurrentMode('flipcard')}
              className={`
                px-6 py-3 rounded-lg font-medium transition-colors
                ${
                  currentMode === 'flipcard'
                    ? 'bg-primary-500 text-white'
                    : settings.mode === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Flashcards
            </motion.button>

            <motion.button
              onClick={() => startQuiz('multiple-choice')}
              className={`
                px-6 py-3 rounded-lg font-medium transition-colors
                ${
                  currentMode === 'quiz'
                    ? 'bg-primary-500 text-white'
                    : settings.mode === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Quiz Mode
            </motion.button>
          </div>
        )}
      </div>

      {currentMode === 'quiz' || currentQuizSession ? (
        <Quiz />
      ) : currentFlashcard ? (
        <FlashCard
          flashcard={currentFlashcard}
          onRate={handleFlashcardRate}
          onMarkLearned={handleMarkLearned}
          showActions={false}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Select a topic to start learning
          </p>
        </div>
      )}
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Learning Statistics</h1>
      <StatsOverview />
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Achievements & Badges</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <BadgeDisplay badges={badges} showAll={true} />
        </div>
        <div>
          <AchievementDisplay achievements={achievements} />
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <SettingsPanel />
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'topics':
        return renderTopics();
      case 'flashcards':
        return renderFlashcards();
      case 'library':
        return renderLibrary();
      case 'learning':
        return renderLearning();
      case 'stats':
        return renderStats();
      case 'achievements':
        return renderAchievements();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <>
      <Layout>
        <div className="hidden lg:block">
          {/* Desktop Navigation is handled in Layout */}
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'dashboard', label: 'Home' },
              { id: 'topics', label: 'Topics' },
              { id: 'flashcards', label: 'Study' },
              { id: 'library', label: 'Library' },
              { id: 'learning', label: 'Quiz' },
              { id: 'stats', label: 'Stats' },
              { id: 'achievements', label: 'Badges' },
              { id: 'settings', label: 'Settings' },
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors
                  ${
                    currentView === item.id
                      ? 'bg-primary-500 text-white'
                      : settings.mode === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: settings.reduceMotion ? 0.1 : 0.3 }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>
      </Layout>

      {/* Tutorial Overlay */}
      <TutorialOverlay />
    </>
  );
}

export default App;
