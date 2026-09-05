"use client";

import React from "react";
import type { Story } from "@/lib/types";
import { useShowBackgrounds } from "./BackgroundToggle";

export default function StoryCard({
  story,
  children,
}: {
  story: Story;
  children: React.ReactNode;
}) {
  const { show } = useShowBackgrounds();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg">
      {show && story.image_path && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${story.image_path})`,
            backgroundSize: "contain",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
