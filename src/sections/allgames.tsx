// src/sections/allgames.tsx
import React from 'react'
import styled from 'styled-components'
import { useGames } from 'gamba-react-ui-v2'
import { GameCard } from './GameCard'  // ← Annahme: dein GameCard-Component

const Container = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #0a001f 0%, #1a0033 100%);
  min-height: 100vh;
  color: white;

  @media (max-width: 768px) {
    padding: 16px;
  }
`

const Title = styled.h1`
  text-align: center;
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #00ffae 0%, #8e2de2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(0, 255, 174, 0.5);
  margin-bottom: 40px;
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 24px;
  }
`

const FilterButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 24px;
  }
`

const FilterButton = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  background: ${({ active }) => active ? 'linear-gradient(135deg, #00ffae, #00cc85)' : 'rgba(0, 255, 174, 0.1)'};
  border: 1px solid ${({ active }) => active ? '#00ffae' : 'rgba(0, 255, 174, 0.3)'};
  border-radius: 50px;
  color: ${({ active }) => active ? '#000' : '#e5fff5'};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ active }) => active ? '0 0 15px rgba(0, 255, 174, 0.6)' : 'none'};
  backdrop-filter: blur(10px);

  &:hover {
    background: linear-gradient(135deg, #00ffae, #00cc85);
    border-color: #00ffae;
    color: #000;
    box-shadow: 0 0 20px rgba(0, 255, 174, 0.8);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 10px 18px;
    font-size: 0.9rem;
  }
`

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (min-width: 480px) and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #00ffae;
  text-shadow: 0 0 10px #00ffae;

  @media (max-width: 768px) {
    height: 150px;
    font-size: 1rem;
  }
`

export default function AllGames() {
  const { games } = useGames()
  const [filter, setFilter] = React.useState('all')
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000) // Fake loading
    return () => clearTimeout(timer)
  }, [])

  const filteredGames = games.filter(game => filter === 'all' || game.category === filter)

  if (loading) {
    return (
      <Container>
        <Title>Games</Title>
        <LoadingSpinner>Loading games... ✨</LoadingSpinner>
      </Container>
    )
  }

  return (
    <Container>
      <Title>Games</Title>

      <FilterButtons>
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
          All
        </FilterButton>
        <FilterButton active={filter === 'slots'} onClick={() => setFilter('slots')}>
          Slots
        </FilterButton>
        <FilterButton active={filter === 'crash'} onClick={() => setFilter('crash')}>
          Crash
        </FilterButton>
        <FilterButton active={filter === 'dice'} onClick={() => setFilter('dice')}>
          Dice
        </FilterButton>
      </FilterButtons>

      <GamesGrid>
        {filteredGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </GamesGrid>
    </Container>
  )
}