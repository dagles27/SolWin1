import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import styled from 'styled-components';
import { useUserStore } from '../../hooks/useUserStore';

const WelcomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  animation: fadeIn 0.6s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const BannerImage = styled.img`
  width: 100%;
  max-width: 1200px;
  border-radius: 14px;
  display: block;
  object-fit: cover;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 5px;
  padding: 12px 22px;
  font-size: 0.95rem;
  font-weight: 600;
  background: #00d596;
  color: #000;
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
      <BannerImage src="/WelcomeBanner-Home.png" alt="Welcome Banner" />

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
