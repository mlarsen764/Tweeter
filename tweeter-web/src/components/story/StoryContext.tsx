import React, { createContext, useContext, useState } from 'react';

interface StoryContextType {
  storyVersion: number;
  bumpStoryVersion: () => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storyVersion, setStoryVersion] = useState(0);

  const bumpStoryVersion = () => {
    setStoryVersion(v => v + 1);
  };

  return (
    <StoryContext.Provider value={{ storyVersion, bumpStoryVersion }}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStoryRefresh = () => {
  const ctx = useContext(StoryContext);
  if (!ctx) {
    // Fallback if not wrapped (won't crash the app)
    return { storyVersion: 0, bumpStoryVersion: () => {} };
  }
  return ctx;
};