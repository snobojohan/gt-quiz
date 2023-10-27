import { useEffect } from 'react';
import '../app/globals.css';
import QuizComponent from '../components/QuizComponent';

export default function Home() {
  
  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    window.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      window.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  return <QuizComponent />;
}
