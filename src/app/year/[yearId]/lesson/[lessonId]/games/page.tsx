import BackLink from "@/components/BackLink";
import OptionCard from "@/components/OptionCard";

export default async function GamesPage({
  params,
}: {
  params: Promise<{ yearId: string; lessonId: string }>;
}) {
  const { yearId, lessonId } = await params;

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto max-w-5xl">
        <BackLink
          href={`/year/${yearId}/lesson/${lessonId}`}
          label="Back to lesson"
        />

        <h1 className="mb-3 text-5xl font-bold text-red-700">Games 游戏</h1>
        <p className="mb-8 text-lg text-gray-600">
          Choose from Pinyin Match, Pinyin Hangman, Fill-in-the-blank, Racing
          Game, or Writer Quiz.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <OptionCard
            title="Pinyin Match"
            description="Match pinyin to the correct Chinese characters."
            href={`/year/${yearId}/lesson/${lessonId}/games/pinyin-match`}
            emoji="对一对"
          />
          <OptionCard
            title="Pinyin Hangman"
            description="Guess the pinyin letters from the character meaning."
            href={`/year/${yearId}/lesson/${lessonId}/games/hangman`}
            emoji="猜一猜"
          />
          <OptionCard
            title="Fill-in-the-blank"
            description="Complete the missing characters in the lesson sentences."
            href={`/year/${yearId}/lesson/${lessonId}/games/fill-in`}
            emoji="填空"
          />
          <OptionCard
            title="Racing Game"
            description="Race the bot by choosing the correct character."
            href={`/year/${yearId}/lesson/${lessonId}/games/race`}
            emoji="赛车"
          />
          <OptionCard
            title="Writer Quiz"
            description="Draw the character that matches the pinyin."
            href={`/year/${yearId}/lesson/${lessonId}/games/writer-quiz`}
            emoji="写字"
          />
        </div>
      </section>
    </main>
  );
}
