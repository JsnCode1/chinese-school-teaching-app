"use client";

import { useState } from "react";
import type { CharacterItem } from "@/lib/types";
import HanziStrokeWriter from "@/components/HanziStrokeWriter";

type Props = {
  character: CharacterItem;
  onClose: () => void;
};

type InfoMode = "none" | "pinyin" | "strokes" | "radical" | "structure";

export default function CharacterPopup({ character, onClose }: Props) {
  const [mode, setMode] = useState<InfoMode>("none");
  const [showPinyin, setShowPinyin] = useState(false);
  const [strokeAnimationCount, setStrokeAnimationCount] = useState(0);
  const [highlightRadical, setHighlightRadical] = useState(false);

  function getInfoText() {
    if (mode === "pinyin") return character.pinyin;
    if (mode === "strokes") {
      return `${character.stroke_count ?? "Unknown"} strokes`;
    }
    if (mode === "radical") return character.radical ?? "Unknown";
    if (mode === "structure") return character.structure ?? "Unknown";
    return "Choose an option";
  }

  function speakChinese(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();

    // Try to find a preferred female Chinese voice
    const preferredVoice =
      voices.find(
        (voice) =>
          voice.name.includes("Tingting") || voice.name.includes("Xiaoxiao"),
      ) || voices.find((voice) => voice.lang === "zh-CN");

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.lang = "zh-CN";

    utterance.rate = 0.2; // Adjust the rate for slower speech

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(utterance);
  }
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative flex w-full max-w-6xl flex-col gap-8 rounded-[2rem] bg-gradient-to-br from-slate-50 to-orange-50 p-8 shadow-2xl md:flex-row"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-4 text-3xl font-bold text-gray-500 hover:text-red-600"
        >
          退出
        </button>

        <div className="flex flex-1 items-center justify-center">
          <div className="relative flex aspect-square w-full max-w-xl flex-col items-center justify-center border-4 border-slate-400 bg-white shadow-lg">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="border-b-2 border-r-2 border-dashed border-slate-300" />
              <div className="border-b-2 border-dashed border-slate-300" />
              <div className="border-r-2 border-dashed border-slate-300" />
              <div />
            </div>

            <div className="absolute left-0 top-1/2 w-full border-t-2 border-dashed border-slate-300" />
            <div className="absolute left-1/2 top-0 h-full border-l-2 border-dashed border-slate-300" />

            {showPinyin && (
              <span className="relative z-10 mb-2 text-5xl font-bold text-red-600">
                {character.pinyin}
              </span>
            )}

            <HanziStrokeWriter
              character={character.character}
              animateTrigger={strokeAnimationCount}
              highlightRadical={highlightRadical}
            />
          </div>
        </div>

        <div className="flex w-full flex-col justify-center gap-5 md:w-72">
          <button
            onClick={() => {
              setShowPinyin((current) => !current);
              setMode("pinyin");
            }}
            className={buttonClass}
          >
            拼音
          </button>

          <button
            onClick={() => speakChinese(character.character)}
            className={buttonClass}
          >
            朗读
          </button>

          <button
            onClick={() => {
              setMode("strokes");
              setStrokeAnimationCount((current) => current + 1);
            }}
            className={buttonClass}
          >
            笔顺 / 笔画
          </button>

          <button
            onClick={() => {
              setMode("radical");
              setHighlightRadical((current) => !current);
            }}
            className={buttonClass}
          >
            部首
          </button>

          <button onClick={() => setMode("structure")} className={buttonClass}>
            结构
          </button>

          <div className="mt-6 rounded-3xl bg-white p-6 text-center shadow">
            <p className="text-lg font-bold text-gray-500">信息</p>
            <p className="mt-3 text-4xl font-extrabold text-red-600">
              {getInfoText()}
            </p>
          </div>

          {character.example && (
            <div className="rounded-3xl bg-yellow-50 p-5 text-center shadow">
              <p className="font-bold text-gray-500">列入</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {character.example}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const buttonClass =
  "rounded-2xl bg-gray-400 px-8 py-4 text-3xl font-bold text-white shadow-lg transition hover:scale-105 hover:bg-red-500";
