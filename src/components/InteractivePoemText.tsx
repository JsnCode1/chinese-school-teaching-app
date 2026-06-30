"use client";

type Props = {
  chineseText: string;
  pinyin: string | null;
};

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
  utterance.rate = 0.67;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function InteractivePoemText({ chineseText, pinyin }: Props) {
  const chineseLines = chineseText.split("\n").filter(Boolean);
  const pinyinLines = pinyin?.split("\n").filter(Boolean) ?? [];

  // Combine all valid lines back together with line breaks for natural reading pauses
  const fullPoemText = chineseLines.join("\n");

  return (
    <div className="flex flex-col gap-6">
      {/* Global Play and Stop Audio Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => speakChinese(fullPoemText)}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-purple-700 active:scale-95"
        >
          读全诗
        </button>

        <button
          onClick={() => window.speechSynthesis?.cancel()}
          className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:scale-95"
        >
          停止朗读
        </button>
      </div>

      {/* Poem Lines Layout */}
      <div className="space-y-6 text-center">
        {chineseLines.map((line, lineIndex) => {
          const chars = line.split("");
          const pinyinWords = pinyinLines[lineIndex]?.split(" ") ?? [];
          let pinyinIndex = 0;

          return (
            <button
              key={lineIndex}
              onClick={() => speakChinese(line)}
              className="block w-full rounded-2xl p-3 transition hover:bg-red-50"
            >
              <div className="flex flex-wrap justify-center gap-4">
                {chars.map((char, charIndex) => {
                  const isPunctuation = "，。！？；：,.!?;:（）() ".includes(
                    char,
                  );

                  if (isPunctuation) {
                    return (
                      <span
                        key={charIndex}
                        className="self-end text-4xl font-bold text-gray-900"
                      >
                        {char}
                      </span>
                    );
                  }

                  const charPinyin = pinyinWords[pinyinIndex++] ?? "";

                  return (
                    <span
                      key={charIndex}
                      className="flex flex-col items-center"
                    >
                      <span className="text-base font-medium text-purple-600">
                        {charPinyin}
                      </span>

                      <span className="text-4xl font-bold text-gray-900 decoration-red-500 decoration-4 underline-offset-8 hover:underline">
                        {char}
                      </span>
                    </span>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
