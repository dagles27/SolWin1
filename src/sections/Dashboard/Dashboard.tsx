import React from 'react'
import styled from 'styled-components'
import { SlideSection } from '../../components/Slider'
import { GAMES } from '../../games'
import { GameCard } from './GameCard'
import { WelcomeBanner } from './WelcomeBanner'
// src/sections/Dashboard/Dashboard.tsx
import FeaturedInlineGame from './FeaturedInlineGame'



export function GameSlider() {
  return (
    <SlideSection>
      {GAMES.map((game) => (
        <div key={game.id} style={{ width: '160px', display: 'flex' }}>
          <GameCard game={game} />
        </div>
      ))}
    </SlideSection>
  )
}

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (min-width: 600px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (min-width: 800px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`

export function GameGrid() {
  return (
    <Grid>
      {GAMES.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </Grid>
  )
}


const GamesHeader = () => (
  <div style={{ width: '100%', textAlign: 'center', margin: '10px 0' }}>
    <img
      src="/games-banner.png"
      alt="Games Header"
      style={{
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        margin: '0 auto',
        borderRadius: '12px',
      }}
    />
  </div>
);

export default function Dashboard() {
  return (
    <>
      <WelcomeBanner />
      <FeaturedInlineGame />
      <GamesHeader />
      <GameGrid />
    </>
  );
}
