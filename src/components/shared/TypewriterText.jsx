// src/components/shared/TypewriterText.jsx
import React, { useState, useEffect } from 'react';

function TypewriterText({ text, speed = 25 }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText(""); 
    
    const intervalId = setInterval(() => {
      setDisplayedText(() => {
        if (currentIndex < text.length) {
          const nextText = text.slice(0, currentIndex + 1);
          currentIndex++;
          return nextText;
        } else {
          clearInterval(intervalId);
          return text;
        }
      });
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}

export default TypewriterText;
