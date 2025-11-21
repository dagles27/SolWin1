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
  LoadingText,
  ErrorText,
  EmptyStateText,
} from './LeaderboardsModal.styles'

interface LeaderboardsModalProps {
  onClose: () => void
  creator: string
}

/* ---------------------------------------------
   WALLET & VOLUME FORMATTER
---------------------------------------------- */

// Kürzt Wallet-Adressen zu: A…b6J
const shortenAddress = (addr: string) => {
  if (!addr) return ""
  return `${addr.slice(0, 1)}…${addr.slice(-3)}`
}

// Zahlformatierung → 2 Nachkommastellen + dt. Komma
const formatUsdVolume = (volume: number) => {
  if (!volume && volume !== 0) return ""
  return volume.toFixed(2).replace('.', ',') // z. B. 234.73 → 234,73
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
                  <RankNumber rank={rank}>
                    {rank}
                  </RankNumber>

                  <PlayerInfo title={entry.user}>
                    {shortenAddress(entry.user)}
                  </PlayerInfo>

                  <VolumeAmount>
                    {formatUsdVolume(entry.usd_volume)}
                  </VolumeAmount>
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