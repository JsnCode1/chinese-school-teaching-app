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
  utterance.rate = 0.6;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function InteractivePoemText({ chineseText, pinyin }: Props) {
  const chineseLines = chineseText.split("\n").filter(Boolean);
  const pinyinLines = pinyin?.split("\n").filter(Boolean) ?? [];

  return (
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
                  <span key={charIndex} className="flex flex-col items-center">
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
  );
}
