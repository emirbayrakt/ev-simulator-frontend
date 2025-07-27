import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} - EV Charge Sim`;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
