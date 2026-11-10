"use client";
import { createContext, useContext } from "react";
import type { useStudyApp } from "./useStudyApp";

export type StudyApp = ReturnType<typeof useStudyApp>;
export const StudyContext = createContext<StudyApp | null>(null);

export function useStudy() {
  const value = useContext(StudyContext);
  if (!value) throw new Error("useStudy must be used inside StudyContext");
  return value;
}
