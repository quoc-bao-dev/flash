import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Topic, TopicStore } from '../types/topicTypes';

const defaultTopics: Topic[] = [
  {
    id: 'general',
    name: 'General',
    description: 'Common everyday vocabulary',
    icon: 'Book',
    color: '#1E90FF',
    isCustom: false,
    createdAt: new Date(),
    flashcardCount: 0,
  },
  {
    id: 'food',
    name: 'Food & Dining',
    description: 'Food, restaurants, and cooking terms',
    icon: 'UtensilsCrossed',
    color: '#FF6B6B',
    isCustom: false,
    createdAt: new Date(),
    flashcardCount: 0,
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Transportation, hotels, and tourism',
    icon: 'Plane',
    color: '#4ECDC4',
    isCustom: false,
    createdAt: new Date(),
    flashcardCount: 0,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Professional and workplace vocabulary',
    icon: 'Briefcase',
    color: '#45B7D1',
    isCustom: false,
    createdAt: new Date(),
    flashcardCount: 0,
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Computers, internet, and digital terms',
    icon: 'Laptop',
    color: '#96CEB4',
    isCustom: false,
    createdAt: new Date(),
    flashcardCount: 0,
  },
  {
    id: 'health',
    name: 'Health & Medicine',
    description: 'Medical and health-related terms',
    icon: 'Heart',
    color: '#FECA57',
    isCustom: false,
    createdAt: new Date(),
    flashcardCount: 0,
  },
];

export const useTopicStore = create<TopicStore>()(
  persist(
    (set, get) => ({
      topics: defaultTopics,
      selectedTopic: null,
      searchQuery: '',
      isLoading: false,
      error: null,

      addTopic: (topicData) => {
        const topic: Topic = {
          ...topicData,
          id: Date.now().toString(),
          createdAt: new Date(),
          flashcardCount: 0,
        };
        set((state) => ({
          topics: [...state.topics, topic],
        }));
      },

      updateTopic: (id, updates) => {
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === id ? { ...topic, ...updates } : topic
          ),
        }));
      },

      deleteTopic: (id) => {
        set((state) => ({
          topics: state.topics.filter(
            (topic) => topic.id !== id || !topic.isCustom
          ),
          selectedTopic:
            state.selectedTopic?.id === id ? null : state.selectedTopic,
        }));
      },

      setSelectedTopic: (topic) => {
        set({ selectedTopic: topic });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      getFilteredTopics: () => {
        const { topics, searchQuery } = get();
        if (!searchQuery) return topics;

        const query = searchQuery.toLowerCase();
        return topics.filter(
          (topic) =>
            topic.name.toLowerCase().includes(query) ||
            topic.description.toLowerCase().includes(query)
        );
      },

      updateFlashcardCount: (topicId, count) => {
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === topicId ? { ...topic, flashcardCount: count } : topic
          ),
        }));
      },
    }),
    {
      name: 'topic-storage',
    }
  )
);
