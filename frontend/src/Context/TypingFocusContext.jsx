import { createContext, useCallback, useContext, useRef, useState } from "react";

const noop = () => {};
const noopRegister = () => noop;

const defaultValue = {
  pauseRefocus: false,
  pauseRef: { current: false },
  setPauseRefocus: noop,
  registerFocusInput: noopRegister,
  focusTypingInput: noop,
};

const TypingFocusContext = createContext(defaultValue);

export const TypingFocusProvider = ({ children }) => {
  const [pauseRefocus, setPauseRefocusState] = useState(false);
  const focusFnRef = useRef(null);
  const pauseRef = useRef(false);

  const setPauseRefocus = useCallback((next) => {
    pauseRef.current = Boolean(next);
    setPauseRefocusState(Boolean(next));
  }, []);

  const registerFocusInput = useCallback((fn) => {
    focusFnRef.current = fn;
    return () => {
      if (focusFnRef.current === fn) focusFnRef.current = null;
    };
  }, []);

  const focusTypingInput = useCallback(() => {
    focusFnRef.current?.();
  }, []);

  return (
    <TypingFocusContext.Provider
      value={{
        pauseRefocus,
        pauseRef,
        setPauseRefocus,
        registerFocusInput,
        focusTypingInput,
      }}
    >
      {children}
    </TypingFocusContext.Provider>
  );
};

export const useTypingFocus = () => useContext(TypingFocusContext);
