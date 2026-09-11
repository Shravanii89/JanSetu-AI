"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type TextSize = "small" | "normal" | "large";

interface TextSizeContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  decreaseTextSize: () => void;
  resetTextSize: () => void;
  increaseTextSize: () => void;
}

const TextSizeContext = createContext<TextSizeContextType | undefined>(undefined);

const STORAGE_KEY = "jansetu_text_size";

export function TextSizeProvider({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSizeState] = useState<TextSize>("normal");

  useEffect(() => {
    // Read from localStorage or cookie on mount
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as TextSize | null;
      if (saved && (saved === "small" || saved === "normal" || saved === "large")) {
        setTextSizeState(saved);
        applyTextSize(saved);
      } else {
        applyTextSize("normal");
      }
    } catch {
      applyTextSize("normal");
    }
  }, []);

  const applyTextSize = (size: TextSize) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-text-size", size);
      if (size === "small") {
        document.documentElement.style.fontSize = "90%";
      } else if (size === "large") {
        document.documentElement.style.fontSize = "112.5%";
      } else {
        document.documentElement.style.fontSize = "100%";
      }
    }
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    applyTextSize(size);
    try {
      localStorage.setItem(STORAGE_KEY, size);
      document.cookie = `${STORAGE_KEY}=${size}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {
      console.warn("Could not save text size:", e);
    }
  };

  const decreaseTextSize = () => {
    if (textSize === "large") setTextSize("normal");
    else if (textSize === "normal") setTextSize("small");
    else setTextSize("small");
  };

  const resetTextSize = () => {
    setTextSize("normal");
  };

  const increaseTextSize = () => {
    if (textSize === "small") setTextSize("normal");
    else if (textSize === "normal") setTextSize("large");
    else setTextSize("large");
  };

  return (
    <TextSizeContext.Provider
      value={{
        textSize,
        setTextSize,
        decreaseTextSize,
        resetTextSize,
        increaseTextSize,
      }}
    >
      {children}
    </TextSizeContext.Provider>
  );
}

export function useTextSize() {
  const context = useContext(TextSizeContext);
  if (!context) {
    throw new Error("useTextSize must be used within a TextSizeProvider");
  }
  return context;
}
