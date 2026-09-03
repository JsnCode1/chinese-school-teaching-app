"use client";

import { useEffect, useRef, useState } from "react";
import FillBlankGame from "./FillBlankGame";

type Props = {
  chinese: string;
  pinyin?: string | null;
  english?: string | null;
};

function normalizePinyin(input: string | null | undefined) {
  return (
    input
      ?.split(/\s+/)
      .map((token) => token.replace(/[，。！？；：、,.!?;:…]/g, "").trim())
      .filter(Boolean) ?? []
  );
}

export default function SentencePracticeCard({
  chinese,
  pinyin,
  english,
}: Props) {
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(
    null,
  );
  const [showText, setShowText] = useState(true);
  const [showPinyin, setShowPinyin] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showFillGame, setShowFillGame] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        setVoices(allVoices);
      }
    };

    loadVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  function stopReading() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  useEffect(() => {
    return () => {
      stopReading();
    };
  }, []);

  function speakChinese(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    stopReading();

    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.lang = "zh-CN";
    utteranceRef.current.rate = 0.67;

    const availableVoices =
      voices.length > 0 ? voices : window.speechSynthesis.getVoices();

    const preferredVoice =
      availableVoices.find(
        (voice) =>
          voice.name.includes("Xiaoxiao") ||
          voice.name.includes("Meijia") ||
          voice.name.includes("Yaoyao"),
      ) ||
      availableVoices.find(
        (voice) =>
          voice.name.includes("Tingting") ||
          voice.name.includes("Google 普通话") ||
          voice.name.includes("Google 國語") ||
          voice.name.includes("Huihui"),
      ) ||
      availableVoices.find((voice) => voice.lang === "zh-CN") ||
      availableVoices.find((voice) => voice.lang.startsWith("zh-"));

    if (preferredVoice) {
      utteranceRef.current.voice = preferredVoice;
    }

    utteranceRef.current.onend = () => {
      utteranceRef.current = null;
    };
    utteranceRef.current.onerror = () => {
      utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utteranceRef.current);
  }

  const sentenceParts = chinese.match(/[^。！？!?]+[。！？!?]?/g) ?? [chinese];
  const pinyinWords = normalizePinyin(pinyin);
  let pinyinIndex = 0;

  return (
    <article className="w-full rounded-3xl border-2 border-orange-200 bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-sm font-bold uppercase tracking-wide text-red-500">
          Sentence / 句子
        </span>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowFillGame((c) => !c)}
            className="rounded-full border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-bold text-purple-700 shadow-sm transition hover:bg-purple-100"
          >
            Fill-in Game / 填空游戏
          </button>

          <button
            type="button"
            onClick={() => setShowText((current) => !current)}
            className="rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 shadow-sm transition hover:bg-red-100"
          >
            {showText ? "Hide text / 隐藏文字" : "Show text / 显示文字"}
          </button>

          <button
            type="button"
            onClick={() => setShowPinyin((current) => !current)}
            className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-100"
          >
            {showPinyin ? "Hide pinyin / 隐藏拼音" : "Show pinyin / 显示拼音"}
          </button>

          <button
            type="button"
            onClick={() => setShowEnglish((current) => !current)}
            className="rounded-full border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-bold text-green-700 shadow-sm transition hover:bg-green-100"
          >
            {showEnglish
              ? "Hide English / 隐藏英文"
              : "Show English / 显示英文"}
          </button>

          <button
            type="button"
            onClick={() => speakChinese(chinese)}
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow transition hover:bg-red-700"
          >
            Read whole sentence / 读全句子
          </button>

          <button
            type="button"
            onClick={stopReading}
            className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Stop reading / 停止朗读
          </button>
        </div>
      </div>

      {showText && (
        <div
          onMouseEnter={() => setActiveSentenceIndex(0)}
          onMouseLeave={() => setActiveSentenceIndex(null)}
          onClick={() => speakChinese(chinese)}
          className={`mb-4 rounded-2xl p-4 text-center transition ${
            activeSentenceIndex === 0 ? "bg-red-50" : "bg-orange-50"
          }`}
        >
          <p className="leading-loose flex flex-wrap justify-center gap-1 text-center">
            {sentenceParts.map((part, partIndex) => {
              const isActive = activeSentenceIndex === partIndex;
              const chars = part.split("");

              return (
                <span
                  key={`${part}-${partIndex}`}
                  className={`inline-flex flex-wrap items-end gap-1 rounded-md transition ${
                    isActive ? "bg-red-50" : ""
                  }`}
                >
                  {chars.map((char, charIndex) => {
                    const isPunctuation =
                      "，。！？；：、,.!?;:…（）() “”".includes(char);

                    if (isPunctuation) {
                      return (
                        <span
                          key={`${partIndex}-${charIndex}`}
                          className="inline-flex flex-col items-center justify-end"
                        >
                          <span className="text-sm leading-none opacity-0">
                            &nbsp;
                          </span>
                          <span className="text-3xl font-bold leading-tight text-gray-900">
                            {char}
                          </span>
                        </span>
                      );
                    }

                    const charPinyin = pinyinWords[pinyinIndex++] ?? "";

                    return (
                      <span
                        key={`${partIndex}-${charIndex}`}
                        className="inline-flex flex-col items-center justify-end"
                      >
                        <span className="text-xs font-medium leading-none text-red-600">
                          {showPinyin ? charPinyin : ""}
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
        </div>
      )}

      {showPinyin && pinyin && (
        <p className="mb-2 text-center text-lg italic text-gray-600">
          {pinyin}
        </p>
      )}
      {showEnglish && english && (
        <p className="mb-2 text-center text-gray-800">{english}</p>
      )}
      {showFillGame && (
        <FillBlankGame sentence={chinese} pinyin={pinyin ?? undefined} />
      )}
    </article>
  );
}
