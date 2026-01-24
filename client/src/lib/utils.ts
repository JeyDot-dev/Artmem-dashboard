import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { CurriculumDetail, Item, CurrentTaskInfo, CurriculumWithProgress } from '../../../shared/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate days remaining until a goal date
 * @param endDate - The goal date
 * @returns Number of days remaining, or null if no date provided
 */
export function getDaysRemaining(endDate: Date | string | null): number | null {
  if (!endDate) return null;
  
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const today = new Date();
  
  // Reset time to compare dates only
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Get the current or next task from a curriculum
 * Prioritizes in_progress items, then returns the first not_started item
 * @param curriculum - The curriculum detail
 * @returns Current or next task info, or null if all completed
 */
export function getCurrentOrNextTask(curriculum: CurriculumDetail): CurrentTaskInfo | null {
  // Flatten all items from all sections, preserving section order
  const allItems: Array<Item & { sectionId: number; sectionTitle: string }> = [];
  
  for (const section of curriculum.sections) {
    for (const item of section.items) {
      allItems.push({
        ...item,
        sectionId: section.id,
        sectionTitle: section.title,
      });
    }
  }
  
  // Priority 1: Find first item with status 'in_progress'
  const inProgressItem = allItems.find(item => item.status === 'in_progress');
  if (inProgressItem) {
    return {
      id: inProgressItem.id,
      title: inProgressItem.title,
      type: inProgressItem.type,
      status: inProgressItem.status,
      description: inProgressItem.description,
      sectionId: inProgressItem.sectionId,
      sectionTitle: inProgressItem.sectionTitle,
    };
  }
  
  // Priority 2: Find first item with status 'not_started'
  const nextItem = allItems.find(item => item.status === 'not_started');
  if (nextItem) {
    return {
      id: nextItem.id,
      title: nextItem.title,
      type: nextItem.type,
      status: nextItem.status,
      description: nextItem.description,
      sectionId: nextItem.sectionId,
      sectionTitle: nextItem.sectionTitle,
    };
  }
  
  return null;
}

/**
 * Scroll to an item with highlight animation
 * @param itemId - The ID of the item to scroll to
 */
export function scrollToItem(itemId: number): void {
  const element = document.querySelector(`[data-item-id="${itemId}"]`);
  
  if (element) {
    // Smooth scroll to element
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    
    // Add highlight class
    element.classList.add('item-highlight');
    
    // Remove highlight after animation
    setTimeout(() => {
      element.classList.remove('item-highlight');
    }, 2000);
  }
}

/**
 * Filters curriculums based on a search query.
 * Search is performed across title, author, and platform fields.
 * Uses AND logic: all words must appear in the combined searchable text.
 * 
 * @param curriculums - Array of curriculums to filter
 * @param query - Search query string
 * @returns Filtered array of curriculums
 */
export function filterCurriculums(
  curriculums: CurriculumWithProgress[],
  query: string
): CurriculumWithProgress[] {
  // Empty or whitespace-only query returns all curriculums
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) {
    return curriculums;
  }

  // Split query into individual words
  const searchWords = trimmedQuery.split(/\s+/);

  return curriculums.filter((curriculum) => {
    // Build searchable text from title, author, and platform
    const searchableText = [
      curriculum.title,
      curriculum.author || '',
      curriculum.platform || '',
    ]
      .join(' ')
      .toLowerCase();

    // All words must appear in the searchable text (AND logic)
    return searchWords.every((word) => searchableText.includes(word));
  });
}
