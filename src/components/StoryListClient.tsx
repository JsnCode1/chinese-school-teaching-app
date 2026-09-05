"use client";

import React from "react";
import type { Story } from "@/lib/types";
import { BackgroundProvider, BgToggleButton } from "./BackgroundToggle";
import StoryCard from "./StoryCard";
import InteractiveStoryText from "./InteractiveStoryText";
import InteractivePoemText from "./InteractivePoemText";

export default function StoryListClient({
  stories,
}: {
  stories: Story[] | null;
}) {
  return (
    <BackgroundProvider>
      <div className="mb-6 flex items-center justify-end">
        <BgToggleButton />
      </div>

      <div
        className={
          stories && stories.length > 1
            ? "grid gap-8 lg:grid-cols-2"
            : "space-y-8"
        }
      >
        {(stories as Story[] | null)?.map((story) => (
          <StoryCard key={story.id} story={story}>
            {(story.title || story.author) && (
              <div className="mb-8 text-center">
                {story.title && (
                  <h2 className="text-4xl font-extrabold text-red-700">
                    {story.title}
                  </h2>
                )}

                {story.author && (
                  <p className="mt-2 text-xl font-bold text-gray-500">
                    {story.author}
                  </p>
                )}
              </div>
            )}

            {story.text_format === "poem" ? (
              <InteractivePoemText
                chineseText={story.chinese_text}
                pinyin={story.pinyin}
              />
            ) : (
              <InteractiveStoryText
                chineseText={story.chinese_text}
                pinyin={story.pinyin}
              />
            )}

            <div className="mt-10 rounded-2xl bg-green-50/90 p-4">
              <h2 className="mb-2 text-lg font-bold text-green-700">
                English Translation
              </h2>

              <p className="text-lg text-gray-700">
                {story.english_translation}
              </p>
            </div>
          </StoryCard>
        ))}
      </div>
    </BackgroundProvider>
  );
}
