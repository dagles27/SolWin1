// src/components/GameCard.tsx
import React from 'react'
import { GameBundle } from 'gamba-react-ui-v2'
import { NavLink, useLocation } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

//
// 🔥 Neon Glow Pulse Animation
//
const neonPulse = keyframes`
  0% { box-shadow: 0 0 10px rgba(0,255,140,0.25), 0 0 20px rgba(0,255,140,0.15); }
  50% { box-shadow: 0 0 18px rgba(0,255,140,0.55), 0 0 35px rgba(0,255,140,0.35); }
  100% { box-shadow: 0 0 10px rgba(0,255,140,0.25), 0 0 20px rgba(0,255,140,0.15); }
`

//
// 🔥 Background Shine Animation
//
const shine = keyframes`
  from { background-position: -200% 0; }
  to { background-position: 200% 0; }
`

//
// 🎴 New Sol-Win Style GameCard
//
const StyledGameCard = styled(NavLink)<{ $small: boolean; $background: string }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  width: 100%;
  aspect-ratio: ${({ $small }) => ($small ? '1/.55' : '1/.6')};

  background: ${({ $background }) => $background};
  background-size: cover;
  background-position: center;

  border-radius: 16px;
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: 24px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  /* subtle border & depth */
  border: 1px solid rgba(0, 255, 120, 0.15);
  box-shadow: 0 0 14px rgba(0, 255, 120, 0.15);

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(0,255,160,0.08),
      transparent
    );
    background-size: 200% 100%;
    animation: ${shine} 6s linear infinite;
    opacity: 0.45;
  }

  /* glow pulse */
  &:hover {
    transform: translateY(-4px) scale(1.03);
    animation: ${neonPulse} 1.8s infinite ease-in-out;
    border-color: rgba(0,255,140,0.4);

    & > .play {
      opacity: 1;
      transform: translateY(0);
    }

    & > .image {
      transform: scale(1.03);
      filter: brightness(1.08);
    }
  }

  & > .image {
    position: absolute;
    inset: 0;
    background-size: 85% auto;
    background-position: center;
    background-repeat: no-repeat;
    transition: 0.25s ease;
    transform: scale(0.92);
  }

  & > .play {
    position: absolute;
    bottom: 10px;
    right: 10px;

    padding: 6px 12px;
    font-size: 13px;
    text-transform: uppercase;
    border-radius: 8px;

    background: rgba(0,0,0,0.55);
    border: 1px solid rgba(0,255,140,0.3);
    backdrop-filter: blur(10px);

    opacity: 0;
    transform: translateY(8px);
    transition: 0.25s ease;
  }
`

//
// 🔖 Small Tag (e.g. "VS" badge)
//
const Tag = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;

  padding: 3px 8px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 6px;

  background: rgba(0,0,0,0.65);
  border: 1px solid rgba(0,255,140,0.35);
  color: #00ff9a;

  backdrop-filter: blur(8px);
  text-transform: uppercase;
  z-index: 3;
`

//
// 🎮 GameCard Component
//
export function GameCard({
  game,
}: {
  game: GameBundle & { meta: { tag?: string; [key: string]: any } }
}) {
  const small = useLocation().pathname !== '/'

  return (
    <StyledGameCard
      to={`/${game.id}`}
      $small={small}
      $background={game.meta.background}
    >
      {game.meta.tag && <Tag>{game.meta.tag}</Tag>}

      <div
        className="image"
        style={{ backgroundImage: `url(${game.meta.image})` }}
      />

      <div className="play">
        Play {game.meta.name}
      </div>
    </StyledGameCard>
  )
}
