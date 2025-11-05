import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import styled from 'styled-components';
import { useUserStore } from '../../hooks/useUserStore';

const WelcomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const BannerImage = styled.img`
  width: 100%;
  max-width: 100%;
  border-radius: 12px;
  display: block;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: #00d596;
  color: black;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #00f5b1;
    transform: translateY(-2px);
  }
`;

export function WelcomeBanner() {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { set: setUserModal } = useUserStore();

  const openLink = (url: string) => () => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <WelcomeWrapper>
      <BannerImage src="/games-banner.png" alt="Welcome Banner" />

      <ButtonGroup>
        <ActionButton onClick={openLink('https://www.x.com/SolWin_Casino')}>
          Follow us on X
        </ActionButton>
        <ActionButton onClick={openLink('https://t.me/SOL_WIN_Casino')}>
          Join Telegram
        </ActionButton>
        <ActionButton onClick={openLink('https://linktr.ee/Solwin_Casino')}>
          How to LinkTree
        </ActionButton>
      </ButtonGroup>
    </WelcomeWrapper>
  );
}
