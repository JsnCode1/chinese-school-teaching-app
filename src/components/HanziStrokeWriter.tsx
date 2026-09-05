"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

interface CharacterData {
  strokes: string[];
  medians: number[][][];
  radicals?: number[];
}

export interface HanziStrokeWriterRef {
  nextStroke: () => Promise<void>;
  animate: () => void;
  ready: () => boolean;
  hasNext: () => boolean;
  reset: () => void;
}

type Props = {
  character: string;
  animateTrigger: number;
  highlightRadical: boolean;
  onReadyChange?: (ready: boolean) => void;
  onHasNextChange?: (hasNext: boolean) => void;
};

const HanziStrokeWriter = forwardRef<HanziStrokeWriterRef, Props>(
  (
    {
      character,
      animateTrigger,
      highlightRadical,
      onReadyChange,
      onHasNextChange,
    },
    ref,
  ) => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const writerRef = useRef<any | null>(null);
    const preloadedCharData = useRef<CharacterData | null>(null);

    // States tracking user interaction and drawing locks
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [hasStartedInteraction, setHasStartedInteraction] =
      useState<boolean>(false);

    const [currentStroke, setCurrentStroke] = useState<number>(-1);
    const [strokeCount, setStrokeCount] = useState<number>(0);
    const [ready, setReady] = useState<boolean>(false);

    // Sync ready state with parent
    useEffect(() => {
      if (typeof onReadyChange === "function") onReadyChange(ready);
    }, [ready, onReadyChange]);

    // FIX: Modified evaluation logic. If the full loop animation completes (currentStroke === len - 1),
    // hasNext returns TRUE so the button re-enables and acts as a step-through reset switch.
    useEffect(() => {
      const len =
        writerRef.current?._character?.strokes?.length ?? strokeCount ?? 0;

      const hasNext = !isAnimating && (!hasStartedInteraction || len > 0); // Always true after load unless it's currently drawing

      if (typeof onHasNextChange === "function") onHasNextChange(hasNext);
    }, [
      currentStroke,
      strokeCount,
      hasStartedInteraction,
      isAnimating,
      onHasNextChange,
    ]);

    const latestStrokeCount = useRef(strokeCount);
    useEffect(() => {
      latestStrokeCount.current = strokeCount;
    }, [strokeCount]);

    // Isolated initialization factory function
    const createWriterInstance = (
      charData: CharacterData | null,
      forceHideCharacter: boolean = false,
    ) => {
      if (!targetRef.current) return null;
      targetRef.current.innerHTML = "";

      const options: Record<string, any> = {
        width: 420,
        height: 420,
        padding: 20,
        showOutline: true,
        showCharacter: !forceHideCharacter,
        strokeAnimationSpeed: 0.66,
        delayBetweenStrokes: 190,
        radicalColor: highlightRadical ? "#FF0000" : undefined,
      };

      if (charData) {
        options.charDataLoader = () => charData;
      }

      const HanziWriterModule =
        (window as any).HanziWriter || require("hanzi-writer");
      const HanziWriter = HanziWriterModule.default ?? HanziWriterModule;

      return HanziWriter.create(targetRef.current, character, options);
    };

    // Component Mount / Cleanup Lifecycle
    useEffect(() => {
      if (!targetRef.current) return;

      let isCancelled = false;
      targetRef.current.innerHTML = "";
      setReady(false);
      setIsAnimating(false);
      setHasStartedInteraction(false);

      const loadWriter = async () => {
        try {
          const HanziWriterModule = await import("hanzi-writer");
          const HanziWriter =
            (HanziWriterModule as any).default ?? HanziWriterModule;
          (window as any).HanziWriter = HanziWriter;

          if (!targetRef.current || isCancelled) return;

          try {
            preloadedCharData.current =
              await HanziWriter.loadCharacterData(character);
          } catch (e) {
            preloadedCharData.current = null;
          }

          if (isCancelled || !targetRef.current) return;

          // Default initial load: character is fully painted black
          writerRef.current = createWriterInstance(
            preloadedCharData.current,
            false,
          );

          const finalCount =
            preloadedCharData.current?.strokes?.length ??
            writerRef.current?._character?.strokes?.length ??
            0;

          setStrokeCount(finalCount);
          setCurrentStroke(-1);
          setReady(true);
        } catch (err) {
          setReady(false);
        }
      };

      void loadWriter();

      return () => {
        isCancelled = true;
        setIsAnimating(false);
        if (targetRef.current) {
          targetRef.current.innerHTML = "";
        }
      };
    }, [character, highlightRadical]);

    // Watch full automatic animation loop trigger
    useEffect(() => {
      if (!writerRef.current || animateTrigger === 0) return;

      setHasStartedInteraction(true);
      setIsAnimating(true);

      if (typeof writerRef.current.cancelQuiz === "function") {
        writerRef.current.cancelQuiz();
      }

      writerRef.current.hideCharacter();
      setCurrentStroke(-1);

      writerRef.current.animateCharacter({
        onComplete: () => {
          setIsAnimating(false);
          // Set to the index of the last stroke because the animation loop drew everything
          setCurrentStroke(Math.max(0, latestStrokeCount.current - 1));
        },
      });
    }, [animateTrigger]);

    const handleReset = () => {
      setIsAnimating(false);
      setHasStartedInteraction(false);
      setCurrentStroke(-1);
      writerRef.current = createWriterInstance(
        preloadedCharData.current,
        false,
      );
    };

    const handleNextStroke = async () => {
      if (!writerRef.current || isAnimating) return;

      const len =
        writerRef.current?._character?.strokes?.length ?? strokeCount ?? 0;
      if (!len) return;

      // Check if the loop completed or if we are sitting past the last stroke bounds
      const isFullLoopComplete = currentStroke >= len - 1;

      if (!hasStartedInteraction || isFullLoopComplete) {
        setHasStartedInteraction(true);
        setIsAnimating(true);
        if (typeof writerRef.current.cancelQuiz === "function") {
          writerRef.current.cancelQuiz();
        }
        writerRef.current = createWriterInstance(
          preloadedCharData.current,
          true,
        );

        // Start drawing the 1st stroke (index 0) from the fresh empty outline canvas
        try {
          await writerRef.current.animateStroke(0);
          if (writerRef.current.showStroke) writerRef.current.showStroke(0);
          setCurrentStroke(0);
        } catch (e) {
          if (writerRef.current.showStroke) writerRef.current.showStroke(0);
          setCurrentStroke(0);
        } finally {
          setIsAnimating(false);
        }
        return;
      }

      const next = currentStroke + 1;
      if (next >= len || next < 0) {
        handleReset();
        return;
      }

      setIsAnimating(true);

      try {
        // Render all previous static strokes safely
        for (let i = 0; i < next; i++) {
          if (writerRef.current.showStroke) {
            writerRef.current.showStroke(i);
          }
        }

        // Animate the single upcoming stroke line smoothly
        await writerRef.current.animateStroke(next);

        if (writerRef.current.showStroke) {
          writerRef.current.showStroke(next);
        }

        setCurrentStroke(next);
      } catch (e) {
        if (writerRef.current?.showStroke) {
          for (let i = 0; i <= next; i++) {
            writerRef.current.showStroke(i);
          }
        }
        setCurrentStroke(next);
      } finally {
        setIsAnimating(false);
      }
    };

    useImperativeHandle(ref, () => ({
      nextStroke: handleNextStroke,
      animate: () => writerRef.current?.animateCharacter?.(),
      ready: () => ready,
      hasNext: () => {
        return !isAnimating; // Always ready to receive clicks as long as an active trace isn't running
      },
      reset: handleReset,
    }));

    return (
      <div ref={targetRef} className="relative z-10 h-[420px] w-[420px]" />
    );
  },
);

HanziStrokeWriter.displayName = "HanziStrokeWriter";
export default HanziStrokeWriter;
