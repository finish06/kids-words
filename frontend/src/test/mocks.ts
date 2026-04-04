import type { CategorySummary, CategoryWordsResponse, Word } from "../types";

export const mockCategories: CategorySummary[] = [
  {
    id: "cat-1",
    name: "Animals",
    slug: "animals",
    icon_url: "https://example.com/animals.png",
    display_order: 1,
    word_count: 6,
  },
  {
    id: "cat-2",
    name: "Colors",
    slug: "colors",
    icon_url: "https://example.com/colors.png",
    display_order: 2,
    word_count: 3,
  },
];

export const mockWords: Word[] = [
  { id: "w1", text: "CAT", image_url: "https://example.com/cat.png" },
  { id: "w2", text: "DOG", image_url: "https://example.com/dog.png" },
  { id: "w3", text: "FISH", image_url: "https://example.com/fish.png" },
  { id: "w4", text: "BIRD", image_url: "https://example.com/bird.png" },
  { id: "w5", text: "FROG", image_url: "https://example.com/frog.png" },
  { id: "w6", text: "BEAR", image_url: "https://example.com/bear.png" },
];

export const mockCategoryWordsResponse: CategoryWordsResponse = {
  category: { id: "cat-1", name: "Animals", slug: "animals" },
  words: mockWords,
};
