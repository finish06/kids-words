export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  display_order: number;
  word_count: number;
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
}
