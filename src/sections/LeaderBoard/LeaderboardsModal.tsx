import React, { useState } from 'react'
import {
  useLeaderboardData,
  Period,
  Player,
} from '../../hooks/useLeaderboardData'

import {
  ModalWrapper,
  ModalContent,
  HeaderSection,
  Title,
  Subtitle,
  TabRow,
  TabButton,
  LeaderboardList,
  ListHeader,
  HeaderRank,
  HeaderPlayer,
  HeaderVolume,
  RankItem,
  RankNumber,
  PlayerInfo,
  VolumeAmount,
  formatVolume,
  LoadingText,
  ErrorText,
  EmptyStateText,
} from './LeaderboardsModal.styles'

interface LeaderboardsModalProps {
  onClose: () => void
  creator: string
}

function formatVolume(volume: number) {
  if (volume >= 1_000_000) return (volume / 1_000_000).toFixed(1) + "M";
  if (volume >= 1_000) return (volume / 1_000).toFixed(1) + "K";
  return volume.toString();
}

const LeaderboardsModal: React.FC<LeaderboardsModalProps> = ({
  onClose,
  creator,
}) => {
  const [period, setPeriod] = useState<Period>('weekly')

  const {
    data: leaderboard,
    loading,
    error,
  } = useLeaderboardData(period, creator)

  return (
    <ModalWrapper onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        
        <HeaderSection>
          <Title>Leaderboard</Title>
          <Subtitle>
            Top players by volume {period === 'weekly' ? 'this week' : 'this month'} (USD)
          </Subtitle>
        </HeaderSection>

        <TabRow>
          <TabButton
            $selected={period === 'weekly'}
            onClick={() => setPeriod('weekly')}
            disabled={loading}
          >
            Weekly
          </TabButton>

          <TabButton
            $selected={period === 'monthly'}
            onClick={() => setPeriod('monthly')}
            disabled={loading}
          >
            Monthly
          </TabButton>
        </TabRow>

        {loading ? (
          <LoadingText>Loading...</LoadingText>
        ) : error ? (
          <ErrorText>{error}</ErrorText>
        ) : leaderboard && leaderboard.length > 0 ? (
          <LeaderboardList>
            <ListHeader>
              <HeaderRank>Rank</HeaderRank>
              <HeaderPlayer>Player</HeaderPlayer>
              <HeaderVolume>Volume (USD)</HeaderVolume>
            </ListHeader>

            {leaderboard.map((entry: Player, index) => {
              const rank = index + 1
              return (
                <RankItem key={entry.user} $isTop3={rank <= 3}>
                  <RankNumber rank={rank}>{rank > 3 ? rank : ''}</RankNumber>
                  <PlayerInfo title={entry.user}>{entry.user}</PlayerInfo>
                  <VolumeAmount>{formatVolume(entry.usd_volume)}</VolumeAmount>
                </RankItem>
              )
            })}
          </LeaderboardList>
        ) : (
          <EmptyStateText>No leaderboard data for this period.</EmptyStateText>
        )}
      </ModalContent>
    </ModalWrapper>
  )
}

export default LeaderboardsModal