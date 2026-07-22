import { useState, useRef, useCallback, useMemo } from 'react';

export const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const justToggledRef = useRef(false);

  const open = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  }, []);

  const closeImmediate = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    justToggledRef.current = true;
    setIsOpen((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback(() => {
    if (justToggledRef.current) {
      justToggledRef.current = false;
      return;
    }
    setIsOpen(false);
  }, []);

  return useMemo(
    () => ({
      isOpen,
      open,
      close,
      closeImmediate,
      toggle,
      ref,
      justToggledRef,
      handleClickOutside,
    }),
    [isOpen, open, close, closeImmediate, toggle, handleClickOutside]
  );
};
