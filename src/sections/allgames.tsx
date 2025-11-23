// src/sections/allgames.tsx
import React from 'react'
import styled from 'styled-components'
import { useGamba } from 'gamba-react-ui-v2'
import { NavLink } from 'react-router-dom'

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
  text-shadow: 0 0 20px rgba(0, 255, 174, 0.5);
  margin: 0 0 40px 0;
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    font-size: 2.2rem;
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
  }
`

const FilterButton = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  background: ${({ active }) => (active ? 'linear-gradient(135deg, #00ffae, #00cc85)' : 'rgba(0, 255, 174, 0.1)')};
  border: 1px solid ${({ active }) => (active ? '#00ffae' : 'rgba(0, 255, 174, 0.3)')};
  border-radius: 50px;
  color: ${({ active }) => (active ? '#000' : '#e5fff5')};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ active }) => (active ? '0 0 15px rgba(0, 255, 174, 0.6)' : 'none')};

  &:hover {
    background: linear-gradient(135deg, #00ffae, #00cc85);
    border-color: #00ffae;
    color: #000;
    box-shadow: 0 0 20px rgba(0, 255, 174, 0.8);
    transform: translateY(-2px);
  }

  &:active { transform: scale(0.98); }

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

const GameCard = styled(NavLink)`
  display: block;
  background: rgba(12, 12, 20, 0.8);
  border: 1px solid rgba(0, 255, 174, 0.3);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

  &:hover {
    background: rgba(12, 12, 20, 0.95);
    border-color: #00ffae;
    box-shadow: 0 12px 40px rgba(0, 255, 174, 0.4);
    transform: translateY(-6px);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`

const GameTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: #00ffae;
  margin: 0 0 12px 0;
  text-shadow: 0 0 10px rgba(0, 255, 174, 0.5);
`

const GameDescription = styled.p`
  color: #e5fff5;
  opacity: 0.85;
  line-height: 1.5;
  margin: 0 0 20px 0;
  font-size: 0.95rem;
`

const PlayButton = styled.div`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #00ffae, #00cc85);
  border-radius: 12px;
  color: #000;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 255, 174, 0.4);

  &:hover {
    box-shadow: 0 0 25px rgba(0, 255, 174, 0.7);
    transform: translateY(-2px);
  }

  &:active { transform: scale(0.98); }
`

const NoGames = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  font-size: 1.4rem;
  color: #00ffae;
  opacity: 0.8;
`

export default function AllGames() {
  const gamba = useGamba()
  const [filter, setFilter] = React.useState<'all' | string>('all')

  const filteredGames = React.useMemo(() => {
    if (filter === 'all') return gamba.games
    return gamba.games.filter(g => g.category === filter)
  }, [gamba.games, filter])

  const categories = React.useMemo(() => {
    const cats = ['all', ...new Set(gamba.games.map(g => g.category).filter(Boolean))]
    return cats as string[]
  }, [gamba.games])

  if (gamba.games.length === 0) {
    return (
      <Container>
        <Title>Games</Title>
        <NoGames>Loading games... ✨</NoGames>
      </Container>
    )
  }

  return (
    <Container>
      <Title>Games</Title>

      <FilterButtons>
        {categories.map(cat => (
          <FilterButton
            key={cat}
            active={filter === cat}
            onClick={() => setFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </FilterButton>
        ))}
      </FilterButtons>

      <GamesGrid>
        {filteredGames.length === 0 ? (
          <NoGames>No games in this category yet.</NoGames>
        ) : (
          filteredGames.map(game => (
            <GameCard key={game.id} to={`/play/${game.id}`}>
              <GameTitle>{game.name}</GameTitle>
              <GameDescription>{game.description || 'No description'}</GameDescription>
              <PlayButton>Play Now</PlayButton>
            </GameCard>
          ))
        )}
      </GamesGrid>
    </Container>
  )
}