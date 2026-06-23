export type Year = {
  id: string;
  year_number: number;
  title: string;
  description: string | null;
  created_at: string;
};

export type Lesson = {
  id: string;
  year_id: string;
  lesson_number: number;
  title: string;
  description: string;
  created_at: string;
};

export type Story = {
  id: string;
  lesson_id: string;
  chinese_text: string;
  pinyin: string | null;
  english_translation: string | null;
};

export type CharacterItem = {
  id: string;
  lesson_id: string;
  character: string;
  pinyin: string;
  meaning: string;
  example: string | null;

  stroke_count: number | null;
  radical: string | null;
  structure: string | null;
  stroke_order_note: string | null;
  common_words: string[] | null;
};

export type Phrase = {
  id: string;
  lesson_id: string;
  chinese_text: string;
  pinyin: string | null;
  english_translation: string | null;
};

export type Sentence = Phrase;
