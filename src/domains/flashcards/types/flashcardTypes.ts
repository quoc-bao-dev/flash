export interface Flashcard {
  id: string;
  englishWord: string;
  vietnameseTranslation: string;
  partOfSpeech: PartOfSpeech;
  phoneticTranscription: string;
  exampleSentence: string;
  pronunciationUrl?: string;
  difficulty: Difficulty;
  isLearned: boolean;
  starRating: number;
  topicId: string;
  createdAt: Date;
  lastReviewed?: Date;
  reviewCount: number;
  easeFactor: number; // For spaced repetition
  nextReviewDate: Date;
}

export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'interjection';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface FlashcardFilter {
  learned?: boolean;
  starRating?: number;
  partOfSpeech?: PartOfSpeech;
  difficulty?: Difficulty;
  topicId?: string;
  searchQuery?: string;
}

export interface FlashcardStore {
  flashcards: Flashcard[];
  currentFlashcard: Flashcard | null;
  filter: FlashcardFilter;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'createdAt'>) => void;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  setCurrentFlashcard: (flashcard: Flashcard | null) => void;
  setFilter: (filter: Partial<FlashcardFilter>) => void;
  clearFilter: () => void;
  getFilteredFlashcards: () => Flashcard[];
  importFlashcards: (flashcards: Flashcard[]) => void;
  exportFlashcards: () => string;
  markAsLearned: (id: string) => void;
  updateReview: (id: string, isCorrect: boolean) => void;
  getFlashcardsForReview: () => Flashcard[];
}