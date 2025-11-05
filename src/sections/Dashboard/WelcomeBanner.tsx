import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import styled from 'styled-components';
import { useUserStore } from '../../hooks/useUserStore';

const BannerWrapper = styled.section`
  width: 100%;
  position: relative;
  overflow: hidden;
  text-align: center;
  margin-top: 70px; /* Abstand unter der fixierten Navbar */
`;

const BannerImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  border-radius: 12px;
`;

const ContentOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 0 2px 10px rgba(0,0,0,0.7);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 25px;
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  background: #ffffffdf;
  color: black;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  flex-grow: 1;
  text-align: center;

  &:hover {
    background: white;
    transform: translateY(-2px);
  }

  @media (min-width: 800px) {
    flex-grow: 0;
  }
`;

export function WelcomeBanner() {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { set: setUserModal } = useUserStore();

  const handleCopyInvite = () => {
    setUserModal({ userModal: true });
    if (!wallet.connected) {
      walletModal.setVisible(true);
    }
  };

  const openLink = (url) => () => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <BannerWrapper>
      {/* Dein Bannerbild */}
      <BannerImage src="/WelcomeBanner-Home.png" alt="Welcome Banner" />

      {/* Text und Buttons im Overlay */}
      <ContentOverlay>
        <h1 style={{ fontSize: '2.5rem', margin: '0' }}>Welcome to SOL-WIN</h1>
        <p style={{ fontSize: '1.25rem', marginTop: '10px' }}>
          Your fair, simple and decentralized casino on Solana.
        </p>

        <ButtonGroup>
          <ActionButton onClick={openLink('https://x.com/solwin_casino')}>
            Follow us on X
          </ActionButton>
          <ActionButton onClick={openLink('https://t.me/SOL_WIN_Casino')}>
            Join Telegram
          </ActionButton>
          <ActionButton onClick={openLink('https://linktr.ee/Solwin_Casino')}>
            How to Start
          </ActionButton>
        </ButtonGroup>
      </ContentOverlay>
    </BannerWrapper>
  );
}
