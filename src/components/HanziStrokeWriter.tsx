"use client";

import { useEffect, useRef } from "react";
import HanziWriter from "hanzi-writer";

type Props = {
  character: string;
  animateTrigger: number;
  highlightRadical: boolean;
};

export default function HanziStrokeWriter({
  character,
  animateTrigger,
  highlightRadical,
}: Props) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<any>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    targetRef.current.innerHTML = "";

    writerRef.current = HanziWriter.create(targetRef.current, character, {
      width: 420,
      height: 420,
      padding: 20,
      showOutline: true,
      showCharacter: true,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 250,

      radicalColor: highlightRadical ? "#FF0000" : undefined,
    });
  }, [character, highlightRadical]);

  useEffect(() => {
    if (!writerRef.current) return;
    if (animateTrigger === 0) return;

    writerRef.current.animateCharacter();
  }, [animateTrigger]);

  return <div ref={targetRef} className="relative z-10" />;
}
