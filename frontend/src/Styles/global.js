import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
* {
  box-sizing: border-box;
}

body {
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textColor};
  margin: 0;
  padding: 0;
  font-family: "Space Grotesk", sans-serif;
  transition: background 0.25s linear, color 0.25s linear;
  -webkit-font-smoothing: antialiased;
}

.canvas {
  display: grid;
  min-height: 100vh;
  grid-template-rows: auto 1fr auto;
  gap: 0.75rem;
  padding: 1.5rem 1.5rem 1.25rem;
  width: 100%;
  max-width: 100%;
  align-items: center;
  text-align: center;
}

.type-box {
  display: block;
  width: min(100%, 65rem);
  height: calc(4.875em + 0.5rem);
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  text-align: left;
}

.words {
  font-family: "Geist Mono", ui-monospace, monospace;
  font-size: 1.5rem;
  line-height: 1.625;
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.625rem;
  row-gap: 0.25rem;
  color: ${({ theme }) => theme.typeBoxText};
}

.word {
  position: relative;
  margin: 0;
  padding-right: 0;
}

.hidden-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.current {
  border-left: 2px solid ${({ theme }) => theme.caret || theme.title};
  margin-left: -2px;
  animation: blinking 1s infinite;
  animation-timing-function: ease-in-out;
}

@keyframes blinking {
  0%, 100% { border-left-color: ${({ theme }) => theme.caret || theme.title}; }
  50% { border-left-color: transparent; }
}

.current-right {
  border-right: 2px solid ${({ theme }) => theme.caret || theme.title};
  animation: blinkingRight 1s infinite;
  animation-timing-function: ease-in-out;
}

@keyframes blinkingRight {
  0%, 100% { border-right-color: ${({ theme }) => theme.caret || theme.title}; }
  50% { border-right-color: transparent; }
}

.correct {
  color: ${({ theme }) => theme.correct || theme.title};
}

.incorrect {
  color: ${({ theme }) => theme.error || "#e7000b"};
}

.extra {
  color: ${({ theme }) => theme.error || "#e7000b"};
  opacity: 0.6;
}

.upper-menu {
  display: flex;
  width: min(100%, 65rem);
  margin-left: auto;
  margin-right: auto;
  font-size: 1.25rem;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-family: "Geist Mono", ui-monospace, monospace;
}

.counter {
  color: ${({ theme }) => theme.title};
  font-weight: 700;
  font-size: 1.5rem;
  min-width: 2ch;
}

.modes {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.time-mode {
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  opacity: 0.55;
  transition: color 0.2s ease, opacity 0.2s ease;
  font-size: 0.95rem;
}

.time-mode:hover {
  opacity: 0.85;
  color: ${({ theme }) => theme.correct || theme.title};
}

.time-mode.active {
  color: ${({ theme }) => theme.title};
  opacity: 1;
  font-weight: 600;
}

.test-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1.25rem;
}

.restart-btn {
  appearance: none;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.45rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, transform 0.2s ease;
}

.restart-btn:hover {
  color: ${({ theme }) => theme.correct || theme.title};
}

.restart-btn:active {
  transform: rotate(90deg);
}

.restart-btn svg {
  width: 18px;
  height: 18px;
  display: block;
}

.shortcut-hint {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textColor};
  opacity: 0.85;
}

.shortcut-hint kbd {
  font-family: "Geist Mono", ui-monospace, monospace;
  font-size: 10px;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  border: 1px solid ${({ theme }) =>
    theme.background === "#ffffff" ? "#e4e4e7" : "rgba(255,255,255,0.12)"};
  background: ${({ theme }) =>
    theme.background === "#ffffff" ? "#f4f4f5" : "rgba(255,255,255,0.06)"};
  color: ${({ theme }) => theme.textColor};
}

.footer {
  width: min(100%, 65rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  color: ${({ theme }) => theme.textColor};
  padding: 0.5rem 0;
  gap: 1rem;
}

.stats-box {
  display: flex;
  width: min(100%, 65rem);
  height: auto;
  margin-left: auto;
  margin-right: auto;
  gap: 1rem;
  text-align: left;
}

.left-stats {
  width: 30%;
  padding: 1.5rem 1rem;
}

.right-stats {
  width: 70%;
  min-height: 220px;
}

.title {
  font-size: 0.95rem;
  color: ${({ theme }) => theme.title};
  margin-top: 0.75rem;
}

.subtitle {
  font-size: 1.75rem;
  font-family: "Geist Mono", ui-monospace, monospace;
  color: ${({ theme }) => theme.correct || theme.textColor};
  font-weight: 600;
}

.header {
  display: flex;
  width: min(100%, 65rem);
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  min-height: 3.5rem;
  justify-content: space-between;
}

.logo {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  justify-content: flex-start;
}

.logo-image {
  display: block;
  height: 2.5rem;
  width: auto;
  object-fit: contain;
  flex-shrink: 0;
}

.logo-wordmark {
  font-family: "Space Grotesk", sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ theme }) => theme.title};
  letter-spacing: -0.02em;
  line-height: 1.1;
  user-select: none;
}

.user-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.textColor};
  cursor: pointer;
}

.user-icon svg {
  color: ${({ theme }) => theme.textColor};
  transition: color 0.2s ease;
}

.user-icon svg:hover {
  color: ${({ theme }) => theme.title};
}

.user-profile {
  width: min(100%, 65rem);
  margin: auto;
  display: flex;
  min-height: 15rem;
  background: ${({ theme }) =>
    theme.background === "#ffffff" ? "#f4f4f5" : theme.typeBoxText};
  border-radius: 0.75rem;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.user {
  width: 50%;
  display: flex;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  padding: 1rem;
  border-right: 2px solid ${({ theme }) => theme.textColor};
}

.info {
  width: 60%;
  padding: 1rem;
  margin-top: 1rem;
}

.picture {
  width: 40%;
}

.total-tests {
  width: 50%;
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.graph,
.table {
  width: min(100%, 65rem);
  margin: auto;
}

.center-of-screen {
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 3rem;
}

.links {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.links a {
  color: ${({ theme }) => theme.textColor};
  text-decoration: none;
  transition: color 0.2s ease;
  display: inline-flex;
  opacity: 0.75;
}

.links a:hover {
  color: ${({ theme }) => theme.title};
  opacity: 1;
}

.themeButton {
  min-width: 10rem;
}

@media (max-width: 1024px) {
  .canvas {
    padding: 1.25rem 1rem;
  }

  .words {
    font-size: 1.35rem;
  }

  .upper-menu {
    font-size: 1.1rem;
  }

  .stats-box {
    flex-direction: column;
  }

  .left-stats,
  .right-stats {
    width: 100%;
  }

  .left-stats {
    padding: 1rem 0;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .canvas {
    padding: 1rem 0.75rem;
    gap: 0.5rem;
  }

  .words {
    font-size: 1.2rem;
  }

  .type-box {
    height: calc(5.5em + 0.5rem);
  }

  .logo-image {
    height: 2rem;
  }

  .logo-wordmark {
    font-size: 1.05rem;
  }

  .upper-menu {
    font-size: 1rem;
  }

  .counter {
    font-size: 1.25rem;
  }

  .shortcut-hint {
    display: none;
  }

  .footer {
    flex-wrap: wrap;
    justify-content: center;
  }

  .user-profile {
    flex-direction: column;
  }

  .user {
    width: 100%;
    border-right: none;
    border-bottom: 2px solid ${({ theme }) => theme.textColor};
  }

  .total-tests {
    width: 100%;
    font-size: 2rem;
    padding: 1rem;
  }
}
`;
