import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Flashcard, FlashcardStore } from '../types/flashcardTypes';
import { sampleFlashcards } from './data';

export const useFlashcardStore = create<FlashcardStore>()(
  persist(
    (set, get) => ({
      flashcards: sampleFlashcards,
      currentFlashcard: null,
      filter: {},
      isLoading: false,
      error: null,

      addFlashcard: (flashcardData) => {
        const flashcard: Flashcard = {
          ...flashcardData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        set((state) => ({
          flashcards: [...state.flashcards, flashcard],
        }));
      },

      updateFlashcard: (id, updates) => {
        set((state) => ({
          flashcards: state.flashcards.map((card) =>
            card.id === id ? { ...card, ...updates } : card
          ),
        }));
      },

      deleteFlashcard: (id) => {
        set((state) => ({
          flashcards: state.flashcards.filter((card) => card.id !== id),
          currentFlashcard:
            state.currentFlashcard?.id === id ? null : state.currentFlashcard,
        }));
      },

      setCurrentFlashcard: (flashcard) => {
        set({ currentFlashcard: flashcard });
      },

      setFilter: (filter) => {
        set((state) => ({
          filter: { ...state.filter, ...filter },
        }));
      },

      clearFilter: () => {
        set({ filter: {} });
      },

      getFilteredFlashcards: () => {
        const { flashcards, filter } = get();
        return flashcards.filter((card) => {
          if (filter.learned !== undefined && card.isLearned !== filter.learned)
            return false;
          if (
            filter.starRating !== undefined &&
            card.starRating < filter.starRating
          )
            return false;
          if (filter.partOfSpeech && card.partOfSpeech !== filter.partOfSpeech)
            return false;
          if (filter.difficulty && card.difficulty !== filter.difficulty)
            return false;
          if (filter.topicId && card.topicId !== filter.topicId) return false;
          if (filter.searchQuery) {
            const query = filter.searchQuery.toLowerCase();
            return (
              card.englishWord.toLowerCase().includes(query) ||
              card.vietnameseTranslation.toLowerCase().includes(query)
            );
          }
          return true;
        });
      },

      importFlashcards: (flashcards) => {
        set((state) => ({
          flashcards: [...state.flashcards, ...flashcards],
        }));
      },

      exportFlashcards: () => {
        const { flashcards } = get();
        return JSON.stringify(flashcards, null, 0);
      },

      markAsLearned: (id) => {
        set((state) => ({
          flashcards: state.flashcards.map((card) =>
            card.id === id ? { ...card, isLearned: true } : card
          ),
        }));
      },

      updateReview: (id, isCorrect) => {
        set((state) => ({
          flashcards: state.flashcards.map((card) => {
            if (card.id !== id) return card;

            const newReviewCount = card.reviewCount + 1;
            let newEaseFactor = card.easeFactor;
            let daysToNext = 1;

            if (isCorrect) {
              if (newReviewCount === 1) daysToNext = 1;
              else if (newReviewCount === 2) daysToNext = 6;
              else daysToNext = Math.round(daysToNext * newEaseFactor);

              newEaseFactor = Math.max(1.3, newEaseFactor + 0.1);
            } else {
              newEaseFactor = Math.max(1.3, newEaseFactor - 0.2);
              daysToNext = 1;
            }

            const nextReviewDate = new Date();
            nextReviewDate.setDate(nextReviewDate.getDate() + daysToNext);

            return {
              ...card,
              reviewCount: newReviewCount,
              easeFactor: newEaseFactor,
              nextReviewDate,
              lastReviewed: new Date(),
            };
          }),
        }));
      },

      getFlashcardsForReview: () => {
        const { flashcards } = get();
        const now = new Date();
        return flashcards.filter((card) => card.nextReviewDate <= now);
      },
    }),
    {
      name: 'flashcard-storage',
    }
  )
);
