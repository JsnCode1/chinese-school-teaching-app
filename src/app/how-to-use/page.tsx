"use client";

import Link from "next/link";
import { useState } from "react";

type LanguageMode = "english" | "chinese" | "both";

type LocalizedText = {
  en: string;
  zh: string;
};

const guideSections: Array<{
  icon: string;
  title: LocalizedText;
  summary: LocalizedText;
  tips: { en: string[]; zh: string[] };
}> = [
  {
    icon: "📖",
    title: { en: "Story", zh: "课文" },
    summary: {
      en: "Use the story page to read the lesson, listen to the pronunciation, and compare the Chinese, pinyin, and English version side by side.",
      zh: "在课文页面中，可以阅读整篇内容，点击听写或朗读句子，并同时查看中文、拼音和英文版本。",
    },
    tips: {
      en: [
        "Hover or click a sentence to highlight it while reading.",
        "Click any sentence to hear it read aloud in Chinese.",
        "Use the Read whole lesson button to listen to the full story at once.",
        "The pinyin sits under each character so you can follow pronunciation as you read.",
      ],
      zh: [
        "阅读时把鼠标放在句子上，或点击句子即可高亮显示。",
        "点击任意句子可以听中文朗读。",
        "点击“读全课文”可以一次听完整篇故事。",
        "每个字下面都有拼音，方便跟读和练习发音。",
      ],
    },
  },
  {
    icon: "🀄",
    title: { en: "Characters", zh: "汉字" },
    summary: {
      en: "Tap a character card to open the character detail popup and learn the meaning, pinyin, and other helpful information.",
      zh: "点击汉字卡片可以打开详细页面，查看意思、拼音和更多帮助信息。",
    },
    tips: {
      en: [
        "Click a character card to open the popup with the character details.",
        "Use the Pinyin button to show the pronunciation for the character.",
        "Use the Read Aloud button to hear the character spoken clearly.",
        "Use the Stroke Order button to replay the animation and the Radical button to highlight the radical.",
      ],
      zh: [
        "点击汉字卡片可以打开详细弹窗。",
        "点击“拼音”按钮可以显示这个字的发音。",
        "点击“朗读”按钮可以听到这个字的标准发音。",
        "点击“笔顺 / 笔画”可以重播字的动画，点击“部首”可以高亮显示部首。",
      ],
    },
  },
  {
    icon: "💬",
    title: { en: "Phrases", zh: "词语" },
    summary: {
      en: "Practise useful phrases by switching between Hanzi, Pinyin, and English views, then click a card to check the answer.",
      zh: "通过切换汉字、拼音和英文模式来练习常用词语，然后点击卡片查看答案。",
    },
    tips: {
      en: [
        "Use the buttons to switch between Show All, Hanzi Only, Pinyin Only, and English Only.",
        "Click any card to flip it and reveal the answer.",
        "Use Reset Everything to go back to the start.",
      ],
      zh: [
        "可以切换“全部”“只看汉字”“只看拼音”“只看英文”四种模式。",
        "点击卡片可以翻转并查看答案。",
        "点击重置可以重新开始练习。",
      ],
    },
  },
  {
    icon: "📝",
    title: { en: "Short Sentences", zh: "短句" },
    summary: {
      en: "Read the sentence, listen to the pronunciation, and compare the Chinese text with the pinyin and English translation.",
      zh: "阅读句子，练习发音，并对照中文、拼音和英文意思进行学习。",
    },
    tips: {
      en: [
        "Each card shows the sentence in Chinese, pinyin, and English.",
        "Read aloud slowly and try to say the sentence from memory.",
        "Use the cards as quick speaking and translation practice.",
      ],
      zh: [
        "每张卡片都会显示中文、拼音和英文翻译。",
        "可以慢慢大声读出来，再尝试背诵。",
        "用这些句子练习口语和翻译。",
      ],
    },
  },
  {
    icon: "🎯",
    title: { en: "Pinyin Match Game", zh: "对一对" },
    summary: {
      en: "Match the correct Chinese character to the matching pinyin by dragging it or tapping it and then tapping the correct answer box.",
      zh: "把正确的汉字拖到对应的拼音框中，或者先点选汉字再点对应拼音来配对。",
    },
    tips: {
      en: [
        "Drag a character card to the matching pinyin slot, or tap a character and then tap the correct pinyin box.",
        "Correct matches turn green and the score updates automatically.",
        "Use Reset to shuffle the activity and play again.",
      ],
      zh: [
        "可以直接拖动汉字到拼音框，也可以先点选汉字，再点对应拼音。",
        "答对后会变成绿色，分数会自动更新。",
        "点击重置可以重新打乱并再次游戏。",
      ],
    },
  },
  {
    icon: "🏎️",
    title: { en: "Race Game", zh: "赛车" },
    summary: {
      en: "Choose the correct character as fast as you can to move your car forward and beat the computer.",
      zh: "快速选择正确汉字，让你的车前进并赢过电脑。",
    },
    tips: {
      en: [
        "Press Start, then read the pinyin and select the matching Hanzi.",
        "Correct answers move your car forward.",
        "Try again if you get a question wrong and keep racing.",
      ],
      zh: [
        "点击开始后，看拼音并选择正确汉字。",
        "答对会让你的车前进。",
        "如果答错可以再试一次继续比赛。",
      ],
    },
  },
  {
    icon: "✍️",
    title: { en: "Writer Quiz", zh: "写字" },
    summary: {
      en: "Click Start Writing, then write the character in the box. You can hide or show the answer, switch to another word, and keep practising until it feels natural.",
      zh: "点击“开始画画”后，在框里写出对应的汉字。你可以切换隐藏或显示答案，换另一个词继续练习，直到书写更加熟练。",
    },
    tips: {
      en: [
        "Press the Start Writing button to begin the exercise and draw the character in the writing area.",
        "Use Hide Answer or Show Answer to control whether the guide outline is visible while you write.",
        "Use the previous and next buttons to move between characters in the lesson.",
        "Use Pick Another Word to choose a different character if you want to practise a different one.",
      ],
      zh: [
        "点击“开始画画”按钮后，就可以在书写区域里写出这个字。",
        "点击“隐藏答案 / 显示答案”可以控制字的参考线是否显示。",
        "可以用上一项和下一项按钮切换不同汉字。",
        "点击“换个词 / Pick Another Word”可以选择其他字继续练习。",
      ],
    },
  },
];

const languageOptions: Array<{ value: LanguageMode; label: string }> = [
  { value: "english", label: "English" },
  { value: "chinese", label: "中文" },
  { value: "both", label: "English + 中文" },
];

function getText(text: LocalizedText, mode: LanguageMode) {
  if (mode === "english") return text.en;
  if (mode === "chinese") return text.zh;
  return `${text.en} / ${text.zh}`;
}

export default function HowToUsePage() {
  const [language, setLanguage] = useState<LanguageMode>("both");

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-6 md:p-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-red-700 shadow transition hover:bg-red-50"
          >
            ← Back home
          </Link>
        </div>

        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-lg">
          <p className="mb-3 inline-block rounded-full bg-red-100 px-4 py-2 font-bold text-red-700">
            How to use this app
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900 md:text-5xl">
            {language === "chinese"
              ? "每个部分怎么用"
              : language === "english"
                ? "How to use each section"
                : "How to use each section / 每个部分怎么用"}
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            {getText(
              {
                en: "Each lesson is designed to help you read, listen, practise, and test your Chinese in different ways. Most sections show the Chinese text, pinyin, and English meaning so you can learn with both reading and listening practice.",
                zh: "每一课都设计成帮助你通过阅读、听力、练习和测试来学习中文。大多数部分都会展示中文、拼音和英文意思，帮助你边读边听。",
              },
              language,
            )}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {languageOptions.map((option) => {
              const isActive = language === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLanguage(option.value)}
                  className={`rounded-full px-5 py-3 font-bold shadow transition ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          {guideSections.map((section) => (
            <article
              key={section.title.en}
              className="rounded-[2rem] border-2 border-orange-200 bg-white p-6 shadow-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="text-3xl">{section.icon}</span>
                <h2 className="text-3xl font-extrabold text-red-700">
                  {getText(section.title, language)}
                </h2>
              </div>

              <p className="mb-4 text-lg text-gray-700">
                {getText(section.summary, language)}
              </p>

              <ul className="grid gap-3 md:grid-cols-2">
                {(language === "english"
                  ? section.tips.en
                  : language === "chinese"
                    ? section.tips.zh
                    : [
                        ...section.tips.en,
                        ...section.tips.zh.map((item) => `中文：${item}`),
                      ]
                ).map((tip, index) => (
                  <li
                    key={`${section.title.en}-${index}`}
                    className="rounded-2xl bg-orange-50 p-4 text-gray-700"
                  >
                    • {tip}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
