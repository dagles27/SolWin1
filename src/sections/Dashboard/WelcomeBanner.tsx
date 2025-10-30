import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import styled from 'styled-components';
import { useUserStore } from '../../hooks/useUserStore

const WelcomeWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  height: 300px;
  width: 100%;
  background: linear-gradient(135deg, #013B33, #036B4F, #00C896);
  background-size: 300% 300%;
  animation: gradientShift 15s ease infinite;
  box-shadow: 0 0 25px rgba(0, 200, 150, 0.2);

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Slide = styled.div`
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: ${(props) => (props.active ? 1 : 0)};
  transition: opacity 1.5s ease-in-out;
  filter: brightness(0.85);
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0, 255, 150, 0.1) 0%, rgba(0, 0, 0, 0.6) 100%);
`;

export function WelcomeBanner() {
  const images = [
    'public/slide1.png',
    'public/slide2.png',
    'public/slide3.png',
    'public/slide4.png',
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <WelcomeWrapper>
      {images.map((img, index) => (
        <Slide
          key={index}
          active={index === current}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      <Overlay />
    </WelcomeWrapper>
  );
}
