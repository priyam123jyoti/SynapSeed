"use client";

export function useMindMapLayout() {
  const calculateLayout = async (prompt: string) => {
    // Fetch from your backend API route instead of importing server code directly
    const response = await fetch('/api/mindmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText: prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate mind map');
    }

    const result = await response.json();
    return result; 
  };

  return { calculateLayout };
}