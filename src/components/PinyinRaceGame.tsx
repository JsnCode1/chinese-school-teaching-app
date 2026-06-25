//ctrl f search:
//  speed = SPEED CONTROL

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
}: {
  characters: CharacterItem[];
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
    <div className="rounded-[2rem] bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-extrabold text-red-700">赛车游戏</h1>
          <p className="mt-2 text-lg font-semibold text-gray-600">
            选择正确的汉字，赢过敌人！
          </p>
        </div>

        {gameStarted && (
          <button
            onClick={startGame}
            className="rounded-full bg-red-600 px-6 py-3 text-xl font-bold text-white shadow transition hover:bg-red-700"
          >
            重新开始
          </button>
        )}
      </div>

      {!gameStarted ? (
        <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[2rem] bg-gradient-to-br from-yellow-50 to-red-50 p-10 text-center">
          <div className="text-8xl">🏎️</div>

          <h2 className="mt-6 text-5xl font-extrabold text-gray-900">
            准备好了吗？
          </h2>

          <p className="mt-4 max-w-xl text-xl font-semibold text-gray-600">
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
        <div className="space-y-5">
          <div className="rounded-3xl bg-blue-50 p-4">
            <div className="mb-2 flex items-center justify-between text-xl font-extrabold text-blue-700">
              <span>
                问题 {answeredCount}/{totalQuestions}
              </span>
              <span>{Math.round(questionProgress)}%</span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${questionProgress}%` }}
              />
            </div>
          </div>

          <div className="space-y-4 rounded-[2rem] bg-gray-50 p-5">
            <RaceTrack label="你" emoji="🏎️" progress={playerProgress} />
            <RaceTrack label="敌人" emoji="🚗" progress={botProgress} />
          </div>

          <div
            className={`rounded-[2rem] p-6 text-center transition ${
              lastAnswer === "correct"
                ? "bg-green-50"
                : lastAnswer === "wrong"
                  ? "bg-red-50"
                  : "bg-yellow-50"
            }`}
          >
            <p className="text-xl font-extrabold text-gray-500">
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
                className="rounded-[2rem] border-2 border-red-100 bg-red-50 p-8 text-7xl font-extrabold text-red-600 shadow-md transition hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {choice.character}
              </button>
            ))}
          </div>
        </div>
      )}
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
    <div>
      <div className="mb-2 flex items-center justify-between text-lg font-extrabold text-gray-700">
        <span>{label}</span>
        <span>{safeProgress}%</span>
      </div>

      <div className="relative h-20 overflow-hidden rounded-full bg-gray-300 shadow-inner">
        <div className="absolute left-0 top-1/2 w-full border-t-4 border-dashed border-white/80" />

        <div className="absolute right-5 top-1/2 z-20 -translate-y-1/2 text-4xl">
          🏁
        </div>

        <div
          className="absolute left-0 top-0 h-full rounded-full bg-blue-200 transition-all duration-500"
          style={{ width: `${safeProgress}%` }}
        />

        <div
          className="absolute top-1/2 z-30 -translate-y-1/2 text-6xl transition-all duration-500"
          style={{
            left: `calc(${safeProgress}% - 2rem)`,
          }}
        >
          {emoji}
        </div>
      </div>
    </div>
  );
}
