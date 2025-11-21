import styled from 'styled-components'

export const ModalWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`

export const ModalContent = styled.div`
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
`

export const HeaderSection = styled.div`
  margin-bottom: 20px;
  text-align: center;
`

export const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  color: #fff;
`

export const Subtitle = styled.p`
  margin: 4px 0 0;
  color: #bbb;
  font-size: 14px;
`

export const TabRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`

export const TabButton = styled.button<{ $selected: boolean }>`
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background: ${({ $selected }) => ($selected ? '#ffcc00' : '#222')};
  color: ${({ $selected }) => ($selected ? '#000' : '#fff')};
  transition: all 0.2s ease;
`

export const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 120px;
  padding-bottom: 6px;
  border-bottom: 1px solid #333;
  color: #aaa;
  font-size: 13px;
`

export const HeaderRank = styled.div``
export const HeaderPlayer = styled.div``
export const HeaderVolume = styled.div``

export const RankItem = styled.div<{ $isTop3: boolean }>`
  display: grid;
  grid-template-columns: 60px 1fr 120px;
  padding: 10px 0;
  align-items: center;
  border-bottom: 1px solid #222;
  background: ${({ $isTop3 }) => ($isTop3 ? 'rgba(255, 204, 0, 0.08)' : 'none')};
`

export const RankNumber = styled.div<{ rank: number }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ rank }) =>
    rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : '#fff'};
`

export const PlayerInfo = styled.div`
  color: #fff;
  font-size: 15px;
`

export const VolumeAmount = styled.div`
  text-align: right;
  color: #0f0;
  font-size: 15px;
`

export const LoadingText = styled.div`
  color: #aaa;
  text-align: center;
  padding: 20px 0;
`

export const ErrorText = styled.div`
  color: #f55;
  text-align: center;
  padding: 20px 0;
`

export const EmptyStateText = styled.div`
  color: #777;
  text-align: center;
  padding: 20px 0;
`

// ✅ FIXED: SAFE FORMAT FUNCTION (verhindert schwarze Screens)
export const formatVolume = (value: number | string | null | undefined) => {
  const num = Number(value)
  if (isNaN(num)) return '0.00'
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}