export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isCustom: boolean;
  createdAt: Date;
  flashcardCount: number;
}

export interface TopicStore {
  topics: Topic[];
  selectedTopic: Topic | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  addTopic: (topic: Omit<Topic, 'id' | 'createdAt' | 'flashcardCount'>) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  setSelectedTopic: (topic: Topic | null) => void;
  setSearchQuery: (query: string) => void;
  getFilteredTopics: () => Topic[];
  updateFlashcardCount: (topicId: string, count: number) => void;
}