import { useEffect, useState, useRef, RefObject } from 'react';

export function useInView(options?: IntersectionObserverInit): [RefObject<any>, boolean] {
  const ref = useRef<any>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, inView];
}
