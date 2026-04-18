export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  display_order: number;
  word_count: number;
  mastery_percentage?: number;
}

export interface CategoryListResponse {
  categories: CategorySummary[];
}

export interface Word {
  id: string;
  text: string;
  image_url: string;
}

export interface CategoryDetail {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryWordsResponse {
  category: CategoryDetail;
  words: Word[];
}

export interface StarUpdate {
  word_id: string;
  new_count: number;
  new_star_level: number;
  just_mastered: boolean;
}

export interface MatchResultCreate {
  word_id: string;
  selected_word_id: string;
  is_correct: boolean;
  attempt_number: number;
}

export interface MatchResultResponse {
  id: string;
  recorded: boolean;
  responded_at: string;
  star_update: StarUpdate | null;
}

// Profiles

export interface Profile {
  id: string;
  name: string;
  color: string;
  is_guest: boolean;
}

export interface ProfileListResponse {
  profiles: Profile[];
  pin_set: boolean;
  max_profiles: number;
}

// Progress

export interface WordProgressItem {
  word_id: string;
  word_text: string;
  image_url: string;
  category_slug: string;
  first_attempt_correct_count: number;
  star_level: number;
  mastered_at: string | null;
}

export interface ProgressSummary {
  total_words: number;
  mastered: number;
  mastery_percentage: number;
}

export interface CategoryProgressResponse {
  category: CategoryDetail;
  words: WordProgressItem[];
  summary: ProgressSummary;
}

// Word Builder (M7)

export type PatternType = "prefix" | "suffix";

export interface PatternOption {
  id: string;
  text: string;
  type: PatternType;
}

export interface Challenge {
  base_word: string;
  correct_pattern: PatternOption;
  options: PatternOption[];
  result_word: string;
  definition: string;
}

export interface RoundResponse {
  level: number;
  challenges: Challenge[];
}

export interface WordBuilderAttempt {
  pattern_id: string;
  is_correct: boolean;
  attempt_number: number;
}

export interface PatternStarUpdate {
  pattern_id: string;
  new_count: number;
  new_star_level: number;
  just_mastered: boolean;
}

export interface WordBuilderResultResponse {
  id: string;
  recorded: boolean;
  responded_at: string;
  star_update: PatternStarUpdate | null;
}

export interface LevelPatternProgress {
  text: string;
  star_level: number;
  mastered: boolean;
}

export interface LevelProgress {
  level: number;
  unlocked: boolean;
  patterns: LevelPatternProgress[];
  mastery_percentage: number;
}

export interface WordBuilderProgressResponse {
  levels: LevelProgress[];
}
