import React from 'react';

interface MathTextProps {
  text: string;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  // If you are using a math library like KaTeX or react-katex later, you can parse it here.
  // For now, this safely renders the text content while preventing undefined crashes.
  return (
    <span className={className}>
      {text || ''}
    </span>
  );
};