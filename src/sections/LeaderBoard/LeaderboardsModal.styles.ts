import styled from 'styled-components'

// Wrapper für das Modal: dunkler, transparent, blur, zentriert
export const ModalWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  overflow-y: auto;
  padding: 20px;
`

// Inhalt des Modals: abgerundete Ecken, Neon-Rahmen
export const ModalContent = styled.div`
  background: rgba(12, 12, 20, 0.95);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 0 14px rgba(0, 255, 180, 0.45),
              inset 0 0 6px rgba(0, 255, 180, 0.15);
  color: #e5fff5;
  font-family: 'Inter', sans-serif;
`

// Header Section
export const HeaderSection = styled.div`
  margin-bottom: 16px;
`

export const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: #00ff99;
  text-shadow: 0 0 8px rgba(0, 255, 180, 0.6);
`

export const Subtitle = styled.p`
  font-size: 13px;
  margin: 4px 0 0;
  opacity: 0.7;
  color: #a5fff5;
`

// Tabs
export const TabRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`

export const TabButton = styled.button<{ $selected?: boolean }>`
  all: unset;
  cursor: pointer;
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ $selected }) => ($selected ? '#000' : '#00ffc8')};
  background: ${({ $selected }) => ($selected ? '#00ff99' : 'rgba(0, 255, 180, 0.08)')};
  box-shadow: ${({ $selected }) =>
    $selected
      ? '0 0 8px #00ff99, 0 0 16px #00ff9944'
      : 'inset 0 0 4px rgba(0, 255, 180, 0.15)'};
  transition: 0.2s ease;
  &:hover {
    background: ${({ $selected }) => ($selected ? '#00ff99' : 'rgba(0,255,180,0.15)')};
  }
`

// Leaderboard List
export const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  color: #6affd8;
  border-bottom: 1px solid rgba(0, 255, 180, 0.25);
  padding-bottom: 4px;
  margin-bottom: 8px;
`

export const HeaderRank = styled.div`
  width: 40px;
`
export const HeaderPlayer = styled.div`
  flex: 1;
  padding-left: 4px;
`
export const HeaderVolume = styled.div`
  width: 80px;
  text-align: right;
`

export const RankItem = styled.div<{ $isTop3?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 6px 8px;
  border-radius: 10px;
  background: ${({ $isTop3 }) =>
    $isTop3 ? 'rgba(0, 255, 150, 0.08)' : 'rgba(0, 255, 180, 0.04)'};
  color: #e5fff5;
  font-size: 14px;
  font-weight: 500;
  transition: 0.2s ease;

  &:hover {
    background: rgba(0, 255, 180, 0.1);
    box-shadow: 0 0 6px #00ff99;
  }
`

export const RankNumber = styled.div<{ rank: number }>`
  width: 40px;
  font-weight: 700;
  color: ${({ rank }) =>
    rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#cd7f32' : '#e5fff5'};
`

export const PlayerInfo = styled.div`
  flex: 1;
  padding-left: 4px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export const VolumeAmount = styled.div`
  width: 80px;
  text-align: right;
`

// Status Texte
export const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #00ff99;
  font-weight: 600;
`

export const ErrorText = styled.div`
  text-align: center;
  padding: 20px;
  color: #ff4d4d;
  font-weight: 600;
`

export const EmptyStateText = styled.div`
  text-align: center;
  padding: 20px;
  color: #a5fff5;
  font-weight: 500;
`