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
    if (mode === "radical") return "Radical highlighted";
    if (mode === "structure") return character.structure ?? "Unknown";
    return "Choose an option";
  }

  function speakChinese(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (voice) =>
          voice.name.includes("Xiaoxiao") || voice.name.includes("Tingting"),
      ) || voices.find((voice) => voice.lang === "zh-CN");

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.lang = "zh-CN";
    utterance.rate = 0.25;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[95vh] w-full max-w-6xl flex-col gap-4 overflow-y-auto rounded-[2rem] bg-gradient-to-br from-slate-50 to-orange-50 p-6 shadow-2xl"
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-white px-5 py-2 text-2xl font-bold text-gray-500 shadow transition hover:text-red-600"
          >
            退出
          </button>
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-1 items-center justify-center">
            <div className="relative flex h-[550px] w-[550px] max-w-full flex-shrink-0 flex-col items-center justify-center border-4 border-slate-400 bg-white shadow-lg">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                <div className="border-b-2 border-r-2 border-dashed border-slate-300" />
                <div className="border-b-2 border-dashed border-slate-300" />
                <div className="border-r-2 border-dashed border-slate-300" />
                <div />
              </div>

              <div className="absolute left-0 top-1/2 w-full border-t-2 border-dashed border-slate-300" />
              <div className="absolute left-1/2 top-0 h-full border-l-2 border-dashed border-slate-300" />

              <div className="relative z-10 mb-2 h-14">
                {showPinyin && (
                  <span className="text-5xl font-bold text-red-600">
                    {character.pinyin}
                  </span>
                )}
              </div>

              <HanziStrokeWriter
                character={character.character}
                animateTrigger={strokeAnimationCount}
                highlightRadical={mode === "radical" && highlightRadical}
              />
            </div>
          </div>

          <div className="flex w-full flex-col justify-start gap-4 md:h-[550px] md:w-72">
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

            <button
              onClick={() => setMode("structure")}
              className={buttonClass}
            >
              结构
            </button>

            <div className="mt-4 flex h-40 flex-col justify-center rounded-3xl bg-white p-5 text-center shadow">
              <p className="text-lg font-bold text-gray-500">Information</p>
              <p className="mt-3 break-words text-2xl font-extrabold text-red-600">
                {getInfoText()}
              </p>
            </div>

            {character.example && (
              <div className="rounded-3xl bg-yellow-50 p-5 text-center shadow">
                <p className="font-bold text-gray-500">Example</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {character.example}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const buttonClass =
  "rounded-2xl bg-gray-400 px-8 py-4 text-3xl font-bold text-white shadow-lg transition hover:scale-105 hover:bg-red-500";
