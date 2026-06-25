// ctrl f search:
// speed = SPEED CONTROL

"use client";

import { useEffect, useState } from "react";
import type { CharacterItem } from "@/lib/types";

function shuffleArray<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

const QUESTIONS_PER_GAME = 10;
const PLAYER_PROGRESS_PER_CORRECT = 100 / QUESTIONS_PER_GAME;
const BOT_PROGRESS_PER_TICK = 4; // SPEED CONTROL: bigger = bot moves more each tick
const BOT_TICK_MS = 1800; // SPEED CONTROL: smaller = bot moves more often

export default function PinyinRaceGame({
  characters,
  backgroundImage,
}: {
  characters: CharacterItem[];
  backgroundImage?: string | null;
}) {
  const [question, setQuestion] = useState<CharacterItem | null>(null);
  const [choices, setChoices] = useState<CharacterItem[]>([]);
  const [playerProgress, setPlayerProgress] = useState(0);
  const [botProgress, setBotProgress] = useState(0);
  const [message, setMessage] = useState("按开始来玩！");
  const [gameStarted, setGameStarted] = useState(false);
  const [raceMoving, setRaceMoving] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<"correct" | "wrong" | null>(
    null,
  );
  const [questionPool, setQuestionPool] = useState<CharacterItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const totalQuestions =
    questionPool.length || Math.min(QUESTIONS_PER_GAME, characters.length);

  const questionProgress = totalQuestions
    ? (answeredCount / totalQuestions) * 100
    : 0;

  function makeQuestion(pool: CharacterItem[], index: number) {
    const correct = pool[index];

    if (!correct) return;

    const wrongChoices = shuffleArray(
      characters.filter((item) => item.id !== correct.id),
    ).slice(0, 2);

    setQuestion(correct);
    setChoices(shuffleArray([correct, ...wrongChoices]));
  }

  useEffect(() => {
    if (!gameStarted || !raceMoving || gameOver) return;

    const timer = setInterval(() => {
      setBotProgress((current) => {
        const next = Math.min(current + BOT_PROGRESS_PER_TICK, 100); // [SPEED CONTROL] controls the speed of the bot

        if (next >= 100) {
          setGameOver(true);
          setRaceMoving(false);
          setMessage("输了，没事再试试！");
        }

        return next;
      });
    }, BOT_TICK_MS); // [SPEED CONTROL] controls the speed of the bot (every ms)

    return () => clearInterval(timer);
  }, [gameStarted, raceMoving, gameOver]);

  function startGame() {
    const newQuestionPool = shuffleArray(characters).slice(
      0,
      QUESTIONS_PER_GAME,
    );

    setPlayerProgress(0);
    setBotProgress(0);
    setAnsweredCount(0);
    setQuestionPool(newQuestionPool);
    setCurrentQuestionIndex(0);
    setGameOver(false);
    setGameStarted(true);
    setRaceMoving(false);
    setLastAnswer(null);
    setMessage("选择正确的汉字！");

    makeQuestion(newQuestionPool, 0);
  }

  function chooseAnswer(choice: CharacterItem) {
    if (!question || gameOver || !gameStarted) return;

    if (!raceMoving) {
      setRaceMoving(true);
    }

    const isCorrect = choice.id === question.id;

    const nextPlayerProgress = isCorrect
      ? Math.min(playerProgress + PLAYER_PROGRESS_PER_CORRECT, 100)
      : playerProgress;

    if (isCorrect) {
      setPlayerProgress(nextPlayerProgress);
      setLastAnswer("correct");
      setMessage("对了！加油！");

      const nextAnsweredCount = answeredCount + 1;
      setAnsweredCount(nextAnsweredCount);

      if (nextPlayerProgress >= 100) {
        setAnsweredCount(totalQuestions);
        setGameOver(true);
        setRaceMoving(false);
        setMessage("赢了，你到达终点了！");
        return;
      }

      if (nextAnsweredCount >= totalQuestions) {
        setGameOver(true);
        setRaceMoving(false);
        setMessage("问题答完了，但还没到终点。再试试！");
        return;
      }

      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      setTimeout(() => {
        setLastAnswer(null);

        if (nextIndex < questionPool.length) {
          makeQuestion(questionPool, nextIndex);
        }
      }, 450);

      return;
    }

    setLastAnswer("wrong");
    setMessage("不对！再试试！- Try Again!");

    setTimeout(() => {
      setLastAnswer(null);
    }, 450);
  }

  if (characters.length < 3) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow">
        Add at least 3 characters to play.
      </div>
    );
  }

  return (
    <div className="relative min-h-[860px] overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at center,
              rgba(255,255,255,0.92) 0%,
              rgba(255,255,255,0.78) 45%,
              rgba(255,255,255,0.35) 100%
            ),
            url(${backgroundImage ?? "/story-images/default.png"})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-5xl font-extrabold text-red-700">赛车游戏</h1>
            <p className="mt-2 text-xl font-semibold text-gray-700">
              选择正确的汉字，赢过敌人！
            </p>
          </div>

          {gameStarted && (
            <button
              onClick={startGame}
              className="shrink-0 rounded-2xl bg-red-600 px-7 py-4 text-xl font-bold text-white shadow-lg transition hover:bg-red-700"
            >
              重新开始
            </button>
          )}
        </div>

        {!gameStarted ? (
          <div className="flex min-h-[560px] flex-col items-center justify-center rounded-[2rem] bg-white/80 p-10 text-center shadow backdrop-blur-sm">
            <div className="inline-block scale-x-[-1] text-8xl">🏎️</div>

            <h2 className="mt-6 text-5xl font-extrabold text-gray-900">
              准备好了吗？
            </h2>

            <p className="mt-4 max-w-xl text-xl font-semibold text-gray-700">
              看拼音，选正确的汉字。答对你的车会往前跑。
            </p>

            <button
              onClick={startGame}
              className="mt-8 rounded-full bg-red-600 px-10 py-5 text-3xl font-extrabold text-white shadow-lg transition hover:scale-105 hover:bg-red-700"
            >
              开始
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-3xl bg-blue-50/90 p-5 shadow backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between text-2xl font-extrabold text-blue-700">
                <span>
                  问题 {answeredCount}/{totalQuestions}
                </span>
                <span>{Math.round(questionProgress)}%</span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-white shadow-inner">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${questionProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] bg-white/85 p-5 shadow backdrop-blur-sm">
              <RaceTrack label="你" emoji="🏎️" progress={playerProgress} />
              <RaceTrack label="敌人" emoji="🚗" progress={botProgress} />
            </div>

            <div
              className={`rounded-[2rem] border p-6 text-center shadow backdrop-blur-sm transition ${
                lastAnswer === "correct"
                  ? "border-green-200 bg-green-50/90"
                  : lastAnswer === "wrong"
                    ? "border-red-200 bg-red-50/90"
                    : "border-yellow-200 bg-yellow-50/90"
              }`}
            >
              <p className="text-xl font-extrabold text-gray-600">
                选择正确的汉字
              </p>

              <p className="mt-3 text-7xl font-extrabold text-blue-700">
                {question?.pinyin ?? "Ready?"}
              </p>

              <p className="mt-3 text-xl font-bold text-gray-700">{message}</p>
            </div>

            <div className="grid grid-cols-3 gap-5">
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => chooseAnswer(choice)}
                  disabled={!gameStarted || gameOver}
                  className="rounded-[2rem] border-2 border-red-200 bg-white/90 p-8 text-7xl font-extrabold text-red-600 shadow-md backdrop-blur-sm transition hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {choice.character}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RaceTrack({
  label,
  emoji,
  progress,
}: {
  label: string;
  emoji: string;
  progress: number;
}) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="grid grid-cols-[4rem_1fr_4rem_2rem] items-center gap-3">
      <span className="text-2xl font-extrabold text-gray-800">{label}</span>

      <div className="relative h-10 overflow-hidden rounded-full bg-gray-200 shadow-inner">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-200 to-green-300 transition-all duration-500"
          style={{ width: `${safeProgress}%` }}
        />

        <div
          className="absolute top-1/2 z-20 text-3xl transition-all duration-500 ease-out"
          style={{
            left: `clamp(1rem, calc(${safeProgress}% - 1rem), calc(100% - 2.5rem))`,
            transform: "translateY(-50%)",
          }}
        >
          <span className="inline-block scale-x-[-1]">{emoji}</span>
        </div>
      </div>

      <span className="text-xl font-bold text-gray-700">
        {Math.round(safeProgress)}%
      </span>

      <span className="text-2xl">🏁</span>
    </div>
  );
}
