// src/sections/Game/Game.styles.ts
import styled, { css, keyframes } from 'styled-components'

const splashAnimation = keyframes`
  0% { opacity: 1; transform: scale(1); }
  70% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0; transform: scale(1.3); }
`

export const loadingAnimation = keyframes`
  0% { left: -50%; }
  100% { left: 100%; }
`

// Haupt-Container – jetzt mit schönerem Grid & Abstand
export const Container = styled.div`
  width: 100%;
  position: relative;
  display: grid;
  gap: 16px;
  padding: 10px;

  @media (min-width: 640px) {
    gap: 20px;
    padding: 16px;
  }
`

// Splash-Effekt (Gewinn-Animation) – jetzt mit Neon-Glow
export const Splash = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background: radial-gradient(circle at center, #8e2de2 0%, #4a00e0 70%, transparent 100%);
  color: #ffe42d;
  font-size: 4.5rem;
  font-weight: 900;
  text-shadow: 
    0 0 20px #ffe42d,
    0 0 40px #ffe42d,
    0 0 80px #ff6b6b;
  opacity: 0;
  animation: ${splashAnimation} 1.2s ease-out forwards;
`

// Game-Screen – Glassmorphism + lila Rahmen + Glow
export const Screen = styled.div`
  position: relative;
  flex-grow: 1;
  background: rgba(12, 12, 17, 0.7);
  backdrop-filter: blur(12px);
  border: 2px solid #8e2de2;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(142, 45, 226, 0.4),
    inset 0 0 30px rgba(142, 45, 226, 0.2);
  transition: all 0.3s ease;
  height: 600px;

  &:hover {
    box-shadow: 
      0 12px 40px rgba(142, 45, 226, 0.6),
      inset 0 0 40px rgba(142, 45, 226, 0.3);
    border-color: #b854ff;
  }

  @media (max-width: 700px) {
    height: 500px;
    border-radius: 16px;
  }
`

// Loading-Bar – jetzt neon-lila mit Glow
export const StyledLoadingIndicator = styled.div<{$active: boolean}>`
  position: relative;
  height: 5px;
  width: 100%;
  background: rgba(142, 45, 226, 0.2);
  border-radius: 10px;
  overflow: hidden;

  &:after {
    content: "";
    position: absolute;
    top: 0; left: -50%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, #b854ff, #8e2de2);
    box-shadow: 0 0 20px #8e2de2;
    opacity: 0;
    animation: ${loadingAnimation} 1.2s ease-in-out infinite;
    transition: opacity 0.4s;
    ${(props) => props.$active && css`opacity: 1;`}
  }
`

// Controls – jetzt mit Glassmorphism & besserem Layout
export const Controls = styled.div`
  width: 100%;
  background: rgba(26, 27, 40, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(142, 45, 226, 0.4);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
  z-index: 6;

  @media (max-width: 800px) {
    flex-direction: column;
    padding: 16px;
    gap: 12px;
  }

  @media (min-width: 800px) {
    height: 90px;
  }
`

// Icon-Buttons – neon hover
export const IconButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(142, 45, 226, 0.15);
  border: 1px solid rgba(142, 45, 226, 0.3);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #8e2de2;
    box-shadow: 0 0 20px rgba(142, 45, 226, 0.6);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`

// MetaControls (unten links)
export const MetaControls = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  gap: 10px;
  z-index: 6;
`

// Spinner – jetzt neon-lila
export const Spinner = styled.div<{$small?: boolean}>`
  --size: ${({ $small }) => ($small ? '1.2em' : '2em')};
  width: var(--size);
  height: var(--size);
  border: 3px solid rgba(142, 45, 226, 0.3);
  border-top-color: #8e2de2;
  border-radius: 50%;
  animation: ${spinnerAnimation} 0.8s linear infinite;
  box-shadow: 0 0 15px rgba(142, 45, 226, 0.5);
`

const spinnerAnimation = keyframes`
  to { transform: rotate(360deg); }
`

// Setting-Buttons (oben rechts)
export const SettingControls = styled.div`
  & > button {
    all: unset;
    cursor: pointer;
    padding: 10px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    transition: all 0.2s;

    &:hover {
      background: rgba(142, 45, 226, 0.4);
      box-shadow: 0 0 15px rgba(142, 45, 226, 0.5);
    }
  }
`
