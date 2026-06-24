"use client";

import { useState } from "react";

type Props = {
  chineseText: string;
  pinyin: string | null;
};

function splitChineseIntoSentences(text: string) {
  return text.match(/[^。！？!?]+[。！？!?]?/g) ?? [];
}

function speakChinese(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);

  const voices = window.speechSynthesis.getVoices();

  const preferredVoice =
    voices.find(
      (voice) =>
        voice.name.includes("Tingting") || voice.name.includes("Xiaoxiao"),
    ) || voices.find((voice) => voice.lang === "zh-CN");

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.lang = "zh-CN";

  utterance.rate = 0.42;

  window.speechSynthesis.cancel();

  window.speechSynthesis.speak(utterance);
}

export default function InteractiveStoryText({ chineseText, pinyin }: Props) {
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(
    null,
  );

  const chineseSentences = splitChineseIntoSentences(chineseText);

  const pinyinWords = pinyin?.split(" ") ?? [];

  let pinyinIndex = 0;

  return (
    <p className="text-left leading-relaxed">
      {chineseSentences.map((sentence, sentenceIndex) => {
        const chars = sentence.split("");

        const isActive = activeSentenceIndex === sentenceIndex;

        return (
          <span
            key={sentenceIndex}
            onMouseEnter={() => setActiveSentenceIndex(sentenceIndex)}
            onMouseLeave={() => setActiveSentenceIndex(null)}
            onClick={() => speakChinese(sentence)}
            className={`cursor-pointer rounded-md transition ${
              isActive ? "bg-red-50" : ""
            }`}
          >
            {chars.map((char, charIndex) => {
              const isPunctuation = "，。！？；：,.!?;:（）() ".includes(char);

              if (isPunctuation) {
                return (
                  <span
                    key={`${sentenceIndex}-${charIndex}`}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {char}
                  </span>
                );
              }

              const charPinyin = pinyinWords[pinyinIndex++] ?? "";

              return (
                <span
                  key={`${sentenceIndex}-${charIndex}`}
                  className="mb-4 inline-flex flex-col items-center align-bottom"
                >
                  <span className="text-sm font-medium leading-none text-red-600">
                    {charPinyin}
                  </span>

                  <span
                    className={`text-3xl font-bold leading-tight text-gray-900 ${
                      isActive
                        ? "underline decoration-red-500 decoration-4 underline-offset-8"
                        : ""
                    }`}
                  >
                    {char}
                  </span>
                </span>
              );
            })}
          </span>
        );
      })}
    </p>
  );
}
