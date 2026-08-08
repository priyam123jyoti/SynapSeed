"use client";
import { generateMindMap } from '@/services/moanaAI';

export function useMindMapLayout() {
  const calculateLayout = async (prompt: string) => {
    const result = await generateMindMap(prompt);
    // We return the raw result so the Page can handle the complex layout logic
    return result; 
  };

  return { calculateLayout };
}