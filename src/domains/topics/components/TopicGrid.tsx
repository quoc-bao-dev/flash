import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Topic } from '../types/topicTypes';
import { useThemeStore } from '../../ui/store/themeStore';

interface TopicGridProps {
  topics: Topic[];
  selectedTopic?: Topic | null;
  onSelectTopic: (topic: Topic | null) => void;
}

export const TopicGrid: React.FC<TopicGridProps> = ({
  topics,
  selectedTopic,
  onSelectTopic,
}) => {
  const { settings } = useThemeStore();

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      data-tutorial="topics"
    >
      {topics.map((topic, index) => {
        const IconComponent = (Icons as any)[topic.icon] || Icons.Folder;
        const isSelected = selectedTopic?.id === topic.id;

        return (
          <motion.button
            key={topic.id}
            onClick={() =>
              onSelectTopic(
                selectedTopic
                  ? selectedTopic.id === topic.id
                    ? null
                    : topic
                  : topic
              )
            }
            className={`
              relative p-6 rounded-2xl text-left transition-all duration-200
              ${
                isSelected
                  ? 'ring-2 ring-primary-500 shadow-lg'
                  : 'hover:shadow-md'
              }
              ${
                settings.mode === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.05,
              duration: settings.reduceMotion ? 0.1 : 0.3,
            }}
            whileHover={{
              scale: settings.reduceMotion ? 1 : 1.02,
              y: settings.reduceMotion ? 0 : -2,
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Icon */}
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 shadow-sm"
              style={{
                backgroundColor: topic.color + '20',
                color: topic.color,
              }}
            >
              <IconComponent className="w-6 h-6" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{topic.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {topic.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {topic.flashcardCount} words
                </span>
                {topic.isCustom && (
                  <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                    Custom
                  </span>
                )}
              </div>
            </div>

            {/* Selection Indicator */}
            {isSelected && (
              <motion.div
                className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <Icons.Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
