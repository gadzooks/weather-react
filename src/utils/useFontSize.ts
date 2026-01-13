import { useEffect } from 'react';
import useLocalStorage from './localstorage';
import {
  LS_FONT_SIZE_KEY,
  FONT_SIZE_DEFAULT,
} from '../components/weather/Constants';

export const useFontSize = () => {
  const [fontSize, setFontSize] = useLocalStorage(
    LS_FONT_SIZE_KEY,
    FONT_SIZE_DEFAULT
  );

  // Apply font size to document element whenever it changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  return { fontSize, setFontSize };
};
